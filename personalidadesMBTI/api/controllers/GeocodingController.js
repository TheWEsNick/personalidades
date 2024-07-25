module.exports = {
    verify: async function (req, res) {
      const input = req.body.input;
  
      // Verificar se o input é um CEP (8 dígitos)
      const isCep = /^[0-9]{8}$/.test(input);
      if (isCep) {
        try {
          const response = await sails.helpers.searchCep(input);
          if (response.erro) {
            return res.json({ error: 'CEP não encontrado.' });
          }
  
          const { uf, localidade, bairro } = response;
  
          // Obter coordenadas a partir da API de geocodificação do Mapbox
          const geocodeResponse = await sails.helpers.geocodeAddress(`${bairro}, ${localidade}, ${uf}`);
          const { longitude, latitude } = geocodeResponse;
  
          return res.json({
            type: 'cep',
            uf,
            localidade,
            bairro,
            coordinates: { longitude, latitude }
          });
        } catch (error) {
          return res.json({ error: 'Erro ao buscar CEP.' });
        }
      } else {
        return res.json({ type: 'endereco', value: input });
      }
    }
  };
  