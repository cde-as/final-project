const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'frontend/public' directory
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use(
  "/images",
  express.static(path.join(__dirname, "../backend/src/public/images"))
);

// Serve the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Set Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data:"
  );
  next();
});

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

// Example routes for API endpoints
app.get("/api/sleep_quality", async (req, res) => {
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

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    console.log(`Upload path: ${uploadPath}`);
    if (!fs.existsSync(uploadPath)) {
      console.log("Creating uploads folder");
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log(`Saving file as: ${uniqueName}`);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Handle file upload and save entry
app.post("/api/entry", upload.single("photo"), async (req, res) => {
  const { journal_entry } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      `
        INSERT INTO daily_entry (user_id, entry_date, journal_entry, photo_url) 
        VALUES ($1, NOW(), $2, $3) RETURNING *`,
      [1, journal_entry, photoPath]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
