import axios from 'axios';

export default class ApiModule {
  async request(url, method, data) {
    const request = {
      baseURL: 'https://80940c12-0469-42c0-92cb-3d1746680492.mock.pstmn.io',
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
