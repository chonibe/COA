require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      
    },
    migrations: {
      directory: './migrations'
    }
  }
};