import ApiModule from '../module';
import remainingBalancesServices from '@/services/remainingBalances';

class RemainingBalances extends ApiModule {
  async getRemainingBalances(params) {
    const response = await this.request('/remaining-balances/get', 'get', params);
    return remainingBalancesServices.get.convertData(response);
  }

  async addRemainingBalances(params) {
    const requestBody = remainingBalancesServices.add.createRequestBody(params);
    const response = await this.request('/remaining-balances/add', 'put', requestBody);
    return response;
  }

  async updateRemainingBalances(params) {
    const requestBody = remainingBalancesServices.update.createRequestBody(params);
    const response = await this.request('/remaining-balances/update', 'put', requestBody);
    return response;
  }

  async deleteRemainingBalances(params) {
    const requestBody = remainingBalancesServices.delete.createRequestBody(params);
    const response = await this.request('/remaining-balances/delete', 'delete', requestBody);
    return response;
  }
}

export default new RemainingBalances();
