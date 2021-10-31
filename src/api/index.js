import accounts from './modules/accounts';
import operationsDays from './modules/operationsDays';
import transactions from './modules/transactions';

class Api {
  constructor() {
    this.accounts = accounts;
    this.operationsDays = operationsDays;
    this.transactions = transactions;
  }
}

export default new Api();
