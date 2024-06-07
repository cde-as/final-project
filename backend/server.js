const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL pool setup
const pool = new Pool({
  user: "chrisdea",
  host: "localhost",
  database: "final",
  password: "mypass",
  port: 5432,
});

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected:", res.rows[0]);
  }
});

// Example route
app.get("/api/sleep_quality", async (req, res) => {
  /*  try {
    const result = await pool.query("SELECT * FROM sleep_quality");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } */
  const userId = req.query.user_id;
  try {
    const result = await pool.query(
      `
      SELECT sq.* FROM sleep_quality sq
      JOIN entry_categories ec ON sq.sleep_quality_id = ec.sleep_quality_id
      JOIN daily_entry de ON ec.daily_entry_id = de.entry_id
      WHERE de.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/activities", async (req, res) => {
  /*  try {
    const result = await pool.query("SELECT * FROM activities");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } */
  const userId = req.query.user_id;
  try {
    const result = await pool.query(
      `
      SELECT a.* FROM activities a
      JOIN entry_categories ec ON a.activities_id = ec.activities_id
      JOIN daily_entry de ON ec.daily_entry_id = de.entry_id
      WHERE de.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/emotion", async (req, res) => {
  /*  try {
    const result = await pool.query("SELECT * FROM emotion");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } */
  const userId = req.query.user_id;
  try {
    const result = await pool.query(
      `
      SELECT e.* FROM emotion e
      JOIN entry_categories ec ON e.emotion_id = ec.emotion_id
      JOIN daily_entry de ON ec.daily_entry_id = de.entry_id
      WHERE de.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/food", async (req, res) => {
  /*   try {
    const result = await pool.query("SELECT * FROM food");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } */
  const userId = req.query.user_id;
  try {
    const result = await pool.query(
      `
      SELECT f.* FROM food f
      JOIN entry_categories ec ON f.food_id = ec.food_id
      JOIN daily_entry de ON ec.daily_entry_id = de.entry_id
      WHERE de.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/daily_entry", async (req, res) => {
  const userId = req.query.user_id;
  console.log("Received request for user_id:", userId);
  try {
    const result = await pool.query(
      `
        SELECT * FROM daily_entry
        WHERE user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
