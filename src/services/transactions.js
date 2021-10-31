export const transactionsServices = {
  get: {
    convertData(rawData) {
      const convertedData = rawData;
      return convertedData;
    },
  },
  getByAccountNumber: {
    convertToArray({ accountNumber, transactions }) {
      return transactions.Doc.filter((item) => {
        const isTransactionBelongsAccoung = item.AcctCr === accountNumber || item.AcctDB === accountNumber;

        return isTransactionBelongsAccoung ? true : false;
      });
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
