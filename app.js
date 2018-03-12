const { gridCellComponent } = require('./components');
const makeApp = store => new Vue({
    el: '#app',
    store,
    created(){
        this.newGame();
        window.addEventListener('keydown', e => {
            let direction = '';
            switch(e.keyCode){
                case 37: direction = 'LEFT'; break;
                case 38: direction = 'UP'; break;
                case 39: direction = 'RIGHT'; break;
                case 40: direction = 'DOWN'; break;
                default: direction = null; break;
            }
            if(direction) this.slide(direction);
        })
    },
    methods:{
        slide(action){
            this.$store.commit('slide', action);
        },
        newGame(){
            this.$store.commit('newGame');
        }
    },
    computed: {
        displayGrid(){
            return this.$store.state.displayGrid;
        },
    },
    components: {
        'grid-cell': gridCellComponent
    }
})

module.exports = makeApp