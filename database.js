const knex = require('knex');

let db;

if (process.env.NODE_ENV === 'production') {
  db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
  });
} else {
  db = knex({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: 'test',
      database: 'smart-brain'
    }
  });
}

module.exports = db;
