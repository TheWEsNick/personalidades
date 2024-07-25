const axios = require('axios');

module.exports = {
  friendlyName: 'Geocode address',
  description: 'Obtem coordenadas de um endereço usando a API do Mapbox',
  inputs: {
    address: {
      type: 'string',
      required: true,
    },
  },
  fn: async function (inputs) {
    const { address } = inputs;
    const accessToken = 'pk.eyJ1IjoiYW1hbmRpdGEiLCJhIjoiY2x5eWJzdGl4MGhmYzJrcHJuYnY1ZTM3aCJ9.IsaeTvf1a7HSHMV2i3obQQ'; // Substitua pelo seu token de acesso do Mapbox
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`);
    const [longitude, latitude] = response.data.features[0].center;
    return { longitude, latitude };
  }
};
