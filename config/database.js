const parse = require('pg-connection-string').parse;
const config = parse(process.env.DATABASE_URL);
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
				host: config.host,
				port: config.port,
				database: config.database,
				user: config.user,
				password: config.password,
				ssl: false,//{ rejectUnauthorized: false },
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
