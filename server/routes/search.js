const express = require('express');
const { query } = require('../helpers/db.js');
const { pool } = require('pg');
require('dotenv').config()

const search = express.Router();

search.get('/search', async (req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    try {
      const searchQuery = req.query.query;
      const { rows } = await pool.query(
        'SELECT id, title, message FROM post WHERE tsv @@ to_tsquery($1)', 
        [searchQuery]
      );
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  module.exports = search;