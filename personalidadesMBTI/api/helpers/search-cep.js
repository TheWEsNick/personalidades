const axios = require('axios');

module.exports = {
  friendlyName: 'Search CEP',
  description: 'Busca informações de um CEP usando a API ViaCEP',
  inputs: {
    cep: {
      type: 'string',
      required: true,
    },
  },
  fn: async function (inputs) {
    const { cep } = inputs;
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  }
};
