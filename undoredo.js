const EMPTY_STATE = 'emptyState'
const SLIDE = 'slide'
const _ = require('lodash');

let isCreated = false;

const plug = {
    install(Vue) {
        Vue.mixin({
          data() {
            return {
              done: [],
              undone: [],
              newMutation: true,
              canPush: true
            };
          },
          created() {
              if(!isCreated){
                this.$store.subscribe(_.debounce((mutation, state) => {
                    if(this.canPush) {
                      if (mutation.type !== EMPTY_STATE && mutation.type === SLIDE) {
                          this.done.push(state);
                      }
                      if (this.newMutation) {
                          this.undone = [];
                      }
                    }
                }, 500));
              }
          },
          computed: {
            canRedo() {
              return this.undone.length;
            },
            canUndo() {
              return this.done.length;
            }
          },
          methods: {
            redo() {
                let commit = this.undone.pop();
                this.canPush = false;
                this.$store.commit('setState', commit);
                this.canPush = true;
            },
            undo() {
                this.canPush = false;
                const nextState = this.done.pop();
                this.undone.push(nextState);
                this.$store.commit(EMPTY_STATE);
                this.$store.commit('setState', nextState);
                this.canPush = true;
            }
          }
        });
      },
}
module.exports = plug;

window.plug = plug;