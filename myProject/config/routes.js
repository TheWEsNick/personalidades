module.exports.routes = {
  'GET / ': { view: 'pages/index' },
  'GET /resultado ': { view: 'pages/resultado' },
  'GET /': 'MapController.index',
  'POST /search': 'MapController.search'



};