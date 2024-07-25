
const axios = require('axios');

const searchCEP = async (cep) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar CEP ${cep}:`, error.message);
    return null;
  }
};

const getCoordinates = async (location, bairro) => {
  const accessToken = 'pk.eyJ1IjoiYW1hbmRpdGEiLCJhIjoiY2x5eWJzdGl4MGhmYzJrcHJuYnY1ZTM3aCJ9.IsaeTvf1a7HSHMV2i3obQQ';
  const query = encodeURIComponent(`${bairro}, ${location}`);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.features && response.data.features.length > 0) {
      const { center } = response.data.features[0];
      return { longitude: center[0], latitude: center[1] };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erro ao buscar coordenadas para ${query}:`, error.message);
    return null;
  }
};

module.exports = {
  verifyInput: async function(req, res) {
    const input = req.body.input;

    if (!input) {
      return res.badRequest({ error: 'Nenhuma entrada fornecida' });
    }

    const isCep = /^[0-9]{8}$/.test(input);

    if (isCep) {
      const cepData = await searchCEP(input);
      if (cepData) {
        const coordinates = await getCoordinates(cepData.localidade, cepData.bairro);
        if (coordinates) {
          return res.json({
            type: 'cep',
            uf: cepData.uf,
            localidade: cepData.localidade,
            bairro: cepData.bairro,
            coordinates: coordinates
          });
        } else {
          return res.badRequest({ error: 'Erro ao buscar coordenadas' });
        }
      } else {
        return res.badRequest({ error: 'Erro ao buscar dados do CEP' });
      }
    } else {
      return res.json({ type: 'endereco', value: input });
    }
  }
};
