export const accountsServices = {
  get: {
    convertData(response) {
      const convertedData = response;
      return convertedData;
    },
  },
  getAccountsWithBalance: {
    convertData({ response, selectedDate }) {
      const filteredResponse = response.AcctPos.filter((item) => {
        if (item.OpDate === selectedDate) {
          return true;
        }
      });

      const convertedToItems = filteredResponse.map((item) => {
        return {
          accountNumber: item.AcctNum,
          remainingBalance: item.Balance,
        };
      });

      return convertedToItems;
    },
  },
  add: {
    createRequestBody(params) {
      return params;
    },
  },
  update: {
    createRequestBody(params) {
      return params;
    },
  },
  delete: {
    createRequestBody(params) {
      return params;
    },
  },
};
