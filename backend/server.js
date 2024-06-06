const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL pool setup
const pool = new Pool({
    user: 'db_user',
    host: 'db_host',
    database: 'db_name',
    password: 'db_password',
    port: 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected:', res.rows[0]);
    }
});

// Example route
app.get('/api/entry_categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM entry_categories');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
