import ApiModule from '../module';
import transactionsServices from '@/services/accounts';

class Transactions extends ApiModule {
  async getTransactions(params) {
    const response = await this.request('/transactions/get', 'get', params);
    return transactionsServices.get.convertData(response);
  }

  async addTransactions(params) {
    const requestBody = transactionsServices.add.createRequestBody(params);
    const response = await this.request('/transactions/add', 'put', requestBody);
    return response;
  }

  async updateTransactions(params) {
    const requestBody = transactionsServices.update.createRequestBody(params);
    const response = await this.request('/transactions/update', 'put', requestBody);
    return response;
  }

  async deleteTransactions(params) {
    const requestBody = transactionsServices.delete.createRequestBody(params);
    const response = await this.request('/transactions/delete', 'delete', requestBody);
    return response;
  }
}

export default new Transactions();
