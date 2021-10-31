export default {
  state: {
    commonLoading: 0,
  },
  mutations: {
    INCREASE_LOADING(state) {
      state.commonLoading++;
    },
    DECREASE_LOADING(state) {
      state.commonLoading--;
    },
  },
  actions: {},
  getters: {
    isLoading(state) {
      console.log('is loading', Boolean(state.commonLoading));
      return Boolean(state.commonLoading);
    },
  },
};
