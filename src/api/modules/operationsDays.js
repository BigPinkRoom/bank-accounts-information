import ApiModule from '../module';
import operationsDaysServices from '@/services/operationsDays';

class OperationsDays extends ApiModule {
  async getOperationsDays(params) {
    const response = await this.request('/operations-days/get', 'get', params);
    return operationsDaysServices.get.convertData(response);
  }

  async addOperationsDays(params) {
    const requestBody = operationsDaysServices.add.createRequestBody(params);
    const response = await this.request('/operations-days/add', 'put', requestBody);
    return response;
  }

  async updateOperationsDays(params) {
    const requestBody = operationsDaysServices.update.createRequestBody(params);
    const response = await this.request('/operations-days/update', 'put', requestBody);
    return response;
  }

  async deleteOperationsDays(params) {
    const requestBody = operationsDaysServices.delete.createRequestBody(params);
    const response = await this.request('/operations-days/delete', 'delete', requestBody);
    return response;
  }
}

export default new OperationsDays();
