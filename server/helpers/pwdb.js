require('dotenv').config()
const { Pool } = require('pg')

   const pools = new Pool({
   connectionString: process.env.DATABASE_URL
});

module.exports = pools;