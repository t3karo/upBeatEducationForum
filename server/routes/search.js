const express = require('express');
require('dotenv').config();
const pool = require('../helpers/db.js');

const search = express.Router();

/* search posts */
search.get('/', async (req, res) => {  
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