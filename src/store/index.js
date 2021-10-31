import Vue from 'vue';
import Vuex from 'vuex';
import loading from './modules/loading';
import message from './modules/message';
import operationsDays from './modules/operationsDays';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    loading,
    message,
    operationsDays,
  },
});
