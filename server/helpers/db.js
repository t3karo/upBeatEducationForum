require('dotenv').config()
const { Pool } = require('pg')

const query = async (sql,values=[]) => {
  return new Promise(async(resolve,reject)=> {
    try {
      const pool = openDb()
      const result = await pool.query(sql,values)
      resolve(result)
    } catch (error) {
      reject(error.message)
    }
  })
}

const openDb = () => {
  const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
  })
  return pool
}

module.exports = {
  query
}

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL
// });

// module.exports = pool;
