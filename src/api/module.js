import axios from 'axios';

export default class ApiModule {
  async request(url, method, data) {
    const request = {
      baseURL: 'https://0964c8ff-460d-43db-8aea-aae8a588b751.mock.pstmn.io',
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

      if (response.data.status === 'ok') {
        return response.data;
      } else {
        throw new Error(response.data.status);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
