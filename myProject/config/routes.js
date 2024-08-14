module.exports.routes = {
  'GET /index': { view: 'pages/index' },
  'GET /': 'MapController.index',
  'POST /search': 'MapController.search' 
};
