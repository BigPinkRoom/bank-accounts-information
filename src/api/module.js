import axios from 'axios';

export default class ApiModule {
  async request(url, method, data) {
    const request = {
      baseURL: 'https://d87419cb-26bf-49ac-956b-bb4bcb5ff6bd.mock.pstmn.io',
      method,
      url,
    };

    if (method === 'get') {
      request.params = data;
    } else {
      request.data = data;
    }

    try {
      const response = await axios(request);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
