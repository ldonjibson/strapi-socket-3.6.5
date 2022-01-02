const strapi = require('strapi');
strapi().start();
strapi.start(() => {
  console.log(strapi.server);
});