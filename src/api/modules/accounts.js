import ApiModule from '../module';

class Accounts extends ApiModule {
  async get(params) {
    return await this.request('/accounts/get', 'get', params);
  }

  async add(requestBody) {
    return await this.request('/accounts/add', 'put', requestBody);
  }

  async update(requestBody) {
    return await this.request('/accounts/update', 'put', requestBody);
  }

  async delete(requestBody) {
    return await this.request('/accounts/delete', 'delete', requestBody);
  }
}

export default new Accounts();
