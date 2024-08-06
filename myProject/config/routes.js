module.exports.routes = {
  'GET / ': { view: 'pages/index' },
  'GET /resultado ': { view: 'pages/resultado' },
  'GET /': { action: 'map/index' },
  'POST /search': { action: 'map/search' }


};