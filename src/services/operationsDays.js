export const operationsDaysServices = {
  get: {
    convertToArray(rawData) {
      const convertedData = rawData.OpDate;
      return convertedData;
    },
    convertToStringsDates(rawData) {
      console.log('raw data', rawData);
      const convertedData = rawData.map((item) => {
        return item.OpDate;
      });
      return convertedData;
    },
    convertToDetail(rawData, selectedDate) {
      const convertedData = rawData.OpDate.map((item) => {
        return item.OpDate;
      });

      const selectedOperationsDay = convertedData.find((day) => day === selectedDate);
      return selectedOperationsDay;
    },
  },
  add: {
    createRequestBody(params) {
      return params;
    },
  },
  update: {
    createRequestBody(params) {
      return params;
    },
  },
  delete: {
    createRequestBody(params) {
      return params;
    },
  },
};
