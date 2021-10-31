import { convertToFloatOne } from '@/helpers/numbers';
import { compareIsoDates } from '@/helpers/date';

export const accountsServices = {
  get: {
    convertData(response) {
      const convertedData = response;
      return convertedData;
    },
  },
  getAccountsWithBalance: {
    convertData({ accounts, transactions, selectedDate }) {
      const selectedTransactions = transactions.Doc.filter((transaction) => {
        if (compareIsoDates(transaction.OpDate, selectedDate) === 'greater') {
          return false;
        } else {
          return true;
        }
      });

      const accountsWithBalance = accounts.AcctAcct.map((account) => {
        let startBalance = account.Ost;

        // console.log('start balance', account.Acct, startBalance);

        selectedTransactions.forEach((transaction) => {
          if (transaction.AcctCr === account.Acct) {
            // console.log('operation less', account.Acct, convertToFloatOne(transaction.Amount));
            startBalance -= convertToFloatOne(transaction.Amount);
          } else if (transaction.AcctDB === account.Acct) {
            // console.log('operation greater', account.Acct, convertToFloatOne(transaction.Amount));
            startBalance += convertToFloatOne(transaction.Amount);
          }
        });

        // console.log('start balance after', account.Acct, startBalance);
        return {
          accountNumber: account.Acct,
          remainingBalance: startBalance.toFixed(1),
        };
      });

      // console.log('accounts with balance', accountsWithBalance);

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
