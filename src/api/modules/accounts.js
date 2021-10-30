import ApiModule from '../module';
import accountsServices from '@/services/accounts';

class Accounts extends ApiModule {
  async getAccounts(params) {
    const response = await this.request('/accounts/get', 'get', params);
    return accountsServices.get.convertData(response);
  }

  async addAccounts(params) {
    const requestBody = accountsServices.add.createRequestBody(params);
    const response = await this.request('/accounts/add', 'put', requestBody);
    return response;
  }

  async updateAccounts(params) {
    const requestBody = accountsServices.update.createRequestBody(params);
    const response = await this.request('/accounts/update', 'put', requestBody);
    return response;
  }

  async deleteAccounts(params) {
    const requestBody = accountsServices.delete.createRequestBody(params);
    const response = await this.request('/accounts/delete', 'delete', requestBody);
    return response;
  }
}

export default new Accounts();
