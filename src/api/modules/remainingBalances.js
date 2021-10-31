import ApiModule from '../module';

class RemainingBalances extends ApiModule {
  async get(params) {
    return await this.request('/remaining-balances/get', 'get', params);
  }

  async add(requestBody) {
    return await this.request('/remaining-balances/add', 'put', requestBody);
  }

  async update(requestBody) {
    return await this.request('/remaining-balances/update', 'put', requestBody);
  }

  async delete(requestBody) {
    return await this.request('/remaining-balances/delete', 'delete', requestBody);
  }
}

export default new RemainingBalances();
