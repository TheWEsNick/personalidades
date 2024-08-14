const axios = require('axios');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const token = 'sk.eyJ1IjoiYW1hbmRpdGEiLCJhIjoiY2x5enVvNm9sMHl5bjJrb3JwMmZuOWRzayJ9.fjMQaKdHXou3BD64oIHWsQ';
const geocodingClient = mbxGeocoding({ accessToken: token });

module.exports = {
  index: function(req, res) {
    return res.view('index', { error: null });
  },

  search: async function(req, res) {
    const input = req.body.input.trim();
    let locationData;

    try {
      if (/^\d{8}$/.test(input)) { // Verifica se é um CEP de 8 dígitos
        locationData = await searchByCEP(input);
        console.log("É CEP")
      } else if (/[a-zA-Z]/.test(input)) { // Verifica se contém letras, indicando um endereço
        locationData = await searchByAddress(input);
        console.log("É endereço")
      } else {
        return res.view('index', { error: 'Entrada inválida. Por favor, insira um CEP ou um endereço válido.' });
      }

      if (!locationData) {
        return res.view('index', { error: 'Localização não encontrada.' });
      }

      return res.view('pages/resultado', {
        longitude: locationData.longitude,
        latitude: locationData.latitude,
        error: null // Passando null explicitamente
      });
    } catch (error) {
      return res.view('index', { error: error.message });
    }
  }
};

async function searchByCEP(cep) {
  const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  const data = response.data;
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  const fullAddress = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brazil`;
  return await geocodeAddress(fullAddress);
}

async function searchByAddress(address) {
  return await geocodeAddress(address);
}

async function geocodeAddress(address) {
  const response = await geocodingClient.forwardGeocode({
    query: address,
    limit: 1
  }).send();

  const match = response.body.features[0];
  if (!match) {
    return null;
  }

  return {
    longitude: match.center[0],
    latitude: match.center[1]
  };
}
