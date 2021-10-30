import accounts from './modules/accounts';
import operationsDays from './modules/operationsDays';
import remainingBalances from './modules/remainingBalances';
import transactions from './modules/transactions';

class Api {
  constructor() {
    this.accounts = accounts;
    this.operationsDays = operationsDays;
    this.remainingBalances = remainingBalances;
    this.transactions = transactions;
  }
}

export default new Api();
