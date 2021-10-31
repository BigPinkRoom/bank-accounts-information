import ApiModule from '../module';

class OperationsDays extends ApiModule {
  async get(params) {
    return await this.request('/operations-days/get', 'get', params);
  }

  async add(requestBody) {
    return await this.request('/operations-days/add', 'put', requestBody);
  }

  async update(requestBody) {
    return await this.request('/operations-days/update', 'put', requestBody);
  }

  async delete(requestBody) {
    return await this.request('/operations-days/delete', 'delete', requestBody);
  }
}

export default new OperationsDays();
