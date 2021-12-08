const routes = require('next-routes')();

routes
    .add('/campaign/new', '/campaign/new')
    .add('/campaign/:address', '/campaign/show')
    .add('/campaign/:address/requests', '/campaign/requests')
    .add('/campaign/:address/requests/new', '/campaign/createRequest')
module.exports = routes;