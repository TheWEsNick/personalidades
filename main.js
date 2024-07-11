const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const axios = require('axios');
//Terminal:
// npm install multer xlsx fs path axios 


//Busca no diretório o arquvio .txt de entrada
const detectTxtFile = (directory) => {
  const files = fs.readdirSync(directory);
  const txtFiles = files.filter(file => path.extname(file) === '.txt');
  return txtFiles.length > 0 ? txtFiles[0] : null;
};
 // Processa os dados do .txt
const processTxtFile = (txtFilePath) => {
  const fileContents = fs.readFileSync(txtFilePath, 'utf8');
  const rows = fileContents.split('\n').map(row => row.split('\t'));

  // Achate o array de linhas se necessário e extraia a coluna relevante para CEPs
  const ceps = rows.flat().filter(cep => cep); // Assume que cada linha é um único CEP
  return ceps;
};

// Busca na api de CEP
const searchCEP = async (cep) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;

  } catch (error) {
    console.error(`Erro ao buscar CEP ${cep}:`, error.message);
    return null;
  }
};
const main = async () => {
    const txtFileName = detectTxtFile(__dirname);
    if (txtFileName) {
      console.log(`Arquivo TXT detectado: ${txtFileName}`);
      const txtFilePath = path.join(__dirname, txtFileName);
      const ceps = processTxtFile(txtFilePath);
  
      console.log('CEPs encontrados:', ceps);
  
      const cepResults = [];
      for (const cep of ceps) {
        const result = await searchCEP(cep);
        if (result) {
          const uf = result.uf;
          const localidade = result.localidade;
          const bairro = result.bairro;
          cepResults.push({ cep, uf, localidade, bairro });
        }
      }
  
      console.log('Resultados da busca de CEPs:', cepResults);

    // Processe os resultados posteriormente, se necessário
      const ws = XLSX.utils.json_to_sheet(cepResults);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'CEPs');
      const outputFilePath = path.join(__dirname, 'output_ceps.xlsx');
      XLSX.writeFile(wb, outputFilePath);

    console.log(`Arquivo XLSX gerado com sucesso: ${outputFilePath}`);
  } else {
    console.log('Nenhum arquivo TXT encontrado na pasta.');
  }
};

main();