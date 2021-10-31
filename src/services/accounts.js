import { convertToFloatOne } from '@/helpers/numbers';
import { compareIsoDates } from '@/helpers/date';
import { uuid } from 'vue-uuid';

export const accountsServices = {
  get: {
    convertToArray(response) {
      const convertedData = response;
      return convertedData;
    },
  },
  getAccountsByTransaction: {
    convertToArray({ transactions, accounts, transactionDate, firstAccountNumber, secondAccountNumber }) {
      console.log('accounts', transactions, accounts);
      const selectedTransactions = transactions.Doc.filter((transaction) => {
        if (compareIsoDates(transaction.OpDate, transactionDate) === 'greater') {
          return false;
        } else {
          return true;
        }
      });

      let remainingFirstAccountBalance = accounts.AcctAcct.find((account) => {
        return account.Acct === firstAccountNumber;
      }).Ost;

      let remainingSecondAccountBalance = accounts.AcctAcct.find((account) => {
        return account.Acct === secondAccountNumber;
      }).Ost;

      selectedTransactions.forEach((transaction) => {
        if (transaction.AcctCr === firstAccountNumber) {
          remainingFirstAccountBalance -= convertToFloatOne(transaction.Amount);
        } else if (transaction.AcctCr === secondAccountNumber) {
          remainingSecondAccountBalance -= convertToFloatOne(transaction.Amount);
        }

        if (transaction.AcctDB === firstAccountNumber) {
          remainingFirstAccountBalance += convertToFloatOne(transaction.Amount);
        } else if (transaction.AcctDB === secondAccountNumber) {
          remainingSecondAccountBalance += convertToFloatOne(transaction.Amount);
        }
      });

      return [
        {
          id: uuid.v4(),
          Acct: firstAccountNumber,
          Ost: remainingFirstAccountBalance,
          isEdit: false,
        },
        {
          id: uuid.v4(),
          Acct: secondAccountNumber,
          Ost: remainingSecondAccountBalance,
          isEdit: false,
        },
      ];
    },
  },
  getAccountsWithBalance: {
    convertToArray({ accounts, transactions, selectedDate }) {
      const selectedTransactions = transactions.Doc.filter((transaction) => {
        if (compareIsoDates(transaction.OpDate, selectedDate) === 'greater') {
          return false;
        } else {
          return true;
        }
      });

      const accountsWithBalance = accounts.AcctAcct.map((account) => {
        let startBalance = account.Ost;

        selectedTransactions.forEach((transaction) => {
          if (transaction.AcctCr === account.Acct) {
            startBalance -= convertToFloatOne(transaction.Amount);
          } else if (transaction.AcctDB === account.Acct) {
            startBalance += convertToFloatOne(transaction.Amount);
          }
        });

        return {
          id: uuid.v4(),
          accountNumber: account.Acct,
          remainingBalance: startBalance.toFixed(1),
          isEdit: false,
        };
      });

      return accountsWithBalance;
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
