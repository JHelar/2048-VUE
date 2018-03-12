const undoredo = require('./undoredo');
const store = require('./store');
Vue.use(undoredo)
Vue.use(Vuex);
const app = require('./app')(store);
