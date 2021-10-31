export const transactionsServices = {
  get: {
    convertToArray({ transactions }) {
      const convertedData = transactions.Doc;

      const changedAmountToFloat = convertedData.map((transaction) => {
        return {
          AcctCr: transaction.AcctCr,
          AcctDB: transaction.AcctDB,
          Amount: transaction.Amount.toFixed(1),
          OpDate: transaction.OpDate,
        };
      });

      return changedAmountToFloat;
    },
  },
  getByAccountNumber: {
    convertToArray({ accountNumber, transactions }) {
      return transactions.Doc.filter((item) => {
        const isTransactionBelongsAccount = item.AcctCr === accountNumber || item.AcctDB === accountNumber;

        return isTransactionBelongsAccount ? true : false;
      });
    },
  },
  getByOperationsDay: {
    convertToArray({ operationsDay, transactions }) {
      const filteredTransactions = transactions.Doc.filter((item) => {
        console;
        const isTransactionBelongsDate = item.OpDate === operationsDay;

        return isTransactionBelongsDate ? true : false;
      });

      const changedAmountToFloat = filteredTransactions.map((transaction) => {
        return {
          AcctCr: transaction.AcctCr,
          AcctDB: transaction.AcctDB,
          Amount: transaction.Amount.toFixed(1),
          OpDate: transaction.OpDate,
        };
      });

      return changedAmountToFloat;
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
