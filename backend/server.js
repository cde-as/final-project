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

// Serve the images directory
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

// New endpoint to fetch all emotions
app.get("/api/emotions", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM emotion");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Existing endpoint to fetch emotions by user_id
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

// New endpoint to fetch entries along with emotions
/* app.get("/api/index_data", async (req, res) => {
  const userId = req.query.user_id; // Assuming you pass user_id as a query parameter
  try {
    const result = await pool.query(
      `
        SELECT de.entry_id, de.user_id, de.entry_date, de.journal_entry, de.photo_url, e.emotion_id, e.icon, e.emotion_name
        FROM daily_entry de
        JOIN entry_emotions ee ON de.entry_id = ee.entry_id
        JOIN emotion e ON ee.emotion_id = e.emotion_id
        WHERE de.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}); */

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

/* app.get("/api/daily_entry", async (req, res) => {
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
}); */

/* app.get("/api/daily_entry", async (req, res) => {
  const userId = req.query.user_id;
  console.log("Received request for user_id:", userId);
  try {
    const result = await pool.query(
      `
        SELECT de.*, ec.emotion_id
        FROM daily_entry de
        LEFT JOIN entry_categories ec ON de.entry_id = ec.daily_entry_id
        WHERE de.user_id = $1`,
      [userId]
    );

    // Group entries by entry_id and aggregate associated emotions
    const entries = {};
    result.rows.forEach((row) => {
      const entryId = row.entry_id;
      if (!entries[entryId]) {
        entries[entryId] = {
          entry_id: entryId,
          user_id: row.user_id,
          entry_date: row.entry_date,
          journal_entry: row.journal_entry,
          photo_url: row.photo_url,
          emotions: [],
        };
      }
      if (row.emotion_id) {
        entries[entryId].emotions.push(row.emotion_id);
      }
    });

    res.json(Object.values(entries));
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).send("Server error");
  }
}); */

app.get("/api/daily_entry", async (req, res) => {
  const userId = req.query.user_id;
  console.log("Received request for user_id:", userId);
  try {
    const result = await pool.query(
      `
          SELECT de.*, ec.emotion_id
          FROM daily_entry de
          LEFT JOIN entry_categories ec ON de.entry_id = ec.daily_entry_id
          WHERE de.user_id = $1`,
      [userId]
    );

    // Group entries by entry_id and collect emotion_ids for each entry
    const entriesMap = new Map();
    result.rows.forEach((row) => {
      const { entry_id, emotion_id, ...entryData } = row;
      if (!entriesMap.has(entry_id)) {
        entriesMap.set(entry_id, {
          ...entryData,
          emotions: emotion_id ? [emotion_id] : [],
        });
      } else {
        const entry = entriesMap.get(entry_id);
        if (emotion_id) {
          entry.emotions.push(emotion_id);
        }
      }
    });

    // Convert map values to array of entries
    const entries = Array.from(entriesMap.values());

    res.json(entries);
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
  const { journal_entry, emotion } = req.body;
  const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert into daily_entry table
      const result = await client.query(
        `
            INSERT INTO daily_entry (user_id, entry_date, journal_entry, photo_url) 
            VALUES ($1, NOW(), $2, $3) RETURNING entry_id`,
        [1, journal_entry, photoPath]
      );

      const entryId = result.rows[0].entry_id;

      // Insert into entry_categories table for each emotion ID
      for (const emotionId of emotion) {
        await client.query(
          `
      INSERT INTO entry_categories (daily_entry_id, emotion_id) 
      VALUES ($1, $2)`,
          [entryId, emotionId]
        );
      }

      await client.query("COMMIT");
      res.json(result.rows[0]);
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
