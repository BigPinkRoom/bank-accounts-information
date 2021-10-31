import ApiModule from '../module';

class Transactions extends ApiModule {
  async getTransactions(params) {
    return await this.request('/transactions/get', 'get', params);
  }

  async addTransactions(requestBody) {
    return await this.request('/transactions/add', 'put', requestBody);
  }

  async updateTransactions(requestBody) {
    return await this.request('/transactions/update', 'put', requestBody);
  }

  async deleteTransactions(requestBody) {
    return await this.request('/transactions/delete', 'delete', requestBody);
  }
}

export default new Transactions();
