import ApiModule from '../module';

class Transactions extends ApiModule {
  async get(params) {
    return await this.request('/transactions/get', 'get', params);
  }

  async add(requestBody) {
    return await this.request('/transactions/add', 'put', requestBody);
  }

  async update(requestBody) {
    return await this.request('/transactions/update', 'put', requestBody);
  }

  async delete(requestBody) {
    return await this.request('/transactions/delete', 'delete', requestBody);
  }
}

export default new Transactions();
