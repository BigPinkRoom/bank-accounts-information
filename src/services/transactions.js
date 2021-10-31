import { uuid } from 'vue-uuid';

export const transactionsServices = {
  get: {
    convertToArray({ transactions }) {
      const convertedData = transactions.Doc;

      const changedAmountToFloat = convertedData.map((transaction) => {
        transaction.id = uuid.v4();
        transaction.Amount = transaction.Amount.toFixed(1);
        transaction.isEdit = false;
        return transaction;
      });

      return changedAmountToFloat;
    },
  },
  getByAccountNumber: {
    convertToArray({ accountNumber, transactions }) {
      const filteredTransactions = transactions.Doc.filter((item) => {
        const isTransactionBelongsAccount = item.AcctCr === accountNumber || item.AcctDB === accountNumber;

        return isTransactionBelongsAccount ? true : false;
      });

      const addedId = filteredTransactions.map((element) => {
        element.id = uuid.v4();
        element.isEdit = false;
        return element;
      });

      return addedId;
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
        transaction.id = uuid.v4();
        transaction.Amount = transaction.Amount.toFixed(1);
        transaction.isEdit = false;
        return transaction;
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
