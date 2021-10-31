import api from '@/api';
import { operationsDaysServices } from '@/services/operationsDays';

export default {
  state: {
    operationsDays: [],
  },
  mutations: {
    INITIALIZATION(state, payload) {
      state.operationsDays = payload;
    },
    ADD_OPERATIONS_DAY(state, payload) {
      state.operationsDays.push(payload);
    },
    UPDATE_STATUS(state, payload) {
      const dayIndex = state.operationsDays.findIndex((day) => {
        return day.OpDate === payload.date;
      });
      state.operationsDays[dayIndex] = payload.status;
    },
    DELETE_OPERATIONS_DAY(state, payload) {
      const dayIndex = state.operationsDays.findIndex((day) => {
        return day.OpDate === payload.date;
      });
      state.operationsDays.splice(dayIndex, 1);
    },
  },
  actions: {
    async initializationOperationsDays({ commit }) {
      try {
        const response = await api.operationsDays.get();
        const result = operationsDaysServices.get.convertToArray(response);
        commit('INITIALIZATION', result);
      } catch (error) {
        throw new Error(error);
      }
    },
    async addOperationsDay({ commit }, payload) {
      try {
        await api.operationsDays.add(payload);
        commit('ADD_OPERATIONS_DAY', payload);
      } catch (error) {
        throw new Error(error);
      }
    },
    async UpdateOperationsDayStatus({ commit }, payload) {
      try {
        await api.operationsDays.update(payload);
        commit('UPDATE_OPERATIONS_DAY_STATUS', payload);
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteOperationsDay({ commit }, payload) {
      try {
        await api.operationsDays.add(payload);
        commit('DELETE_OPERATIONS_DAY', payload);
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  getters: {
    getAllOperationsDays(state) {
      console.log('get all operaions days inner', state.operationsDays[0]);
      const convertedOperationsDays = operationsDaysServices.get.convertToStringsDates(state.operationsDays);

      return convertedOperationsDays;
    },
    getOperationsDay(state) {
      return function (selectedData) {
        const convertedOperationsDays = operationsDaysServices.getDetail.convertToDetail(
          state.operationsDays,
          selectedData
        );

        return convertedOperationsDays;
      };
    },
  },
};
