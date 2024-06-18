require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
var cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// PostgreSQL pool setup
const pool = new Pool({
  user: "ina",
  // user: "chrisdea",
  host: "localhost",
  database: "final",
  password: "mypass",
  port: 5432,
});

// Load JWT secret key from environment variable
const secretKey = process.env.JWT_SECRET;

// Register Route
app.post("/api/register", async (req, res) => {
  const { email, username, password } = req.body;
  // const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
      [email, username, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    console.log("Result", result.rows.length);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];
    console.log("user: ", user);
    /*  const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        console.log("Error invalid password:", error);
      return res.status(400).json({ error: "Invalid username or password" });
    } */

    /*  const token = jwt.sign({ user_id: user.user_id }, secretKey, {
      expiresIn: "1h",
    }); */
    const userId = user.user_id;
    res.cookie("my-token", userId);
    console.log("Server API Login", userId);
    res.json({ userId });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Logout
app.post("/logout", (req, res) => {
  //When we click logout, it will clear the user ID cookie and return user to login page
  req.session = null; //Clear the session cookie
  console.log("Logged out. Current users in database: ", users);
  res.redirect("/login");
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.cookies[`my-token`];
  console.log("cookie", token);
  // const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    //const verified = jwt.verify(token, secretKey);
    // req.user = verified;
    // req.query.user_id = token;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Example of a protected route
app.get("/", authenticateToken, (req, res) => {
  //res.json({ message: "This is a protected route" });
  res.sendFile(path.join(__dirname, "../frontend/public", "index.html"));
});

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

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected:', res.rows[0]);
    }
});

// Example routes for API endpoints

//API endpoint for new-entry.js
app.get("/api/new_sleep_quality", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sleep_quality");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

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

//API Activities endpoint for new-entry.js
app.get("/api/new_activities", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM activities");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// API endpoint to fetch activities
app.get("/api/activities", async (req, res) => {
  try {
    const userId = req.query.user_id; // Fetch user_id from query parameters if provided

    let query = "SELECT * FROM activities";
    let params = [];

    // If user_id is provided, filter activities by user_id
    if (userId) {
      query += `
          JOIN entry_categories ec ON activities.activities_id = ec.activities_id
          JOIN daily_entry de ON ec.daily_entry_id = de.entry_id
          WHERE de.user_id = $1`;
      params.push(userId);
    }

    const result = await pool.query(query, params);
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

app.get("/api/daily_entry", async (req, res) => {
  const userId = req.query.user_id;
  console.log("Received request for user_id:", userId);
  try {
    const result = await pool.query(
      `
        SELECT 
          de.entry_id,
          de.user_id,
          de.entry_date,
          de.journal_entry,
          de.photo_url,
          ec.emotion_id,
          ec.activities_id,
          ec.sleep_quality_id
        FROM daily_entry de
        LEFT JOIN entry_categories ec ON de.entry_id = ec.daily_entry_id
        WHERE de.user_id = $1
      `,
      [userId]
    );

    // Group entries by entry_id and collect emotion_ids for each entry
    const entriesMap = new Map();
    result.rows.forEach((row) => {
      const {
        entry_id,
        emotion_id,
        activities_id,
        sleep_quality_id,
        ...entryData
      } = row;
      if (!entriesMap.has(entry_id)) {
        entriesMap.set(entry_id, {
          entry_id, // Ensure entry_id is included
          ...entryData,
          emotions: emotion_id ? [emotion_id] : [],
          activities: activities_id ? [activities_id] : [],
          sleepQuality: sleep_quality_id ? [sleep_quality_id] : [],
        });
      } else {
        const entry = entriesMap.get(entry_id);
        if (emotion_id) {
          entry.emotions.push(emotion_id);
        }
        if (activities_id) {
          entry.activities.push(activities_id);
        }
        if (sleep_quality_id) {
          entry.sleepQuality.push(sleep_quality_id);
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
  const { journal_entry, emotion, sleep_quality, activity } = req.body;
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

      // Insert into entry_activities table for each activity ID
      for (const activityId of activity) {
        await client.query(
          `
              INSERT INTO entry_categories (daily_entry_id, activities_id) 
              VALUES ($1, $2)`,
          [entryId, activityId]
        );
      }
      // Insert into entry_activities table for each sleep quality ID
      for (const sleepQualityId of sleep_quality) {
        await client.query(
          `
              INSERT INTO entry_categories (daily_entry_id, sleep_quality_id) 
              VALUES ($1, $2)`,
          [entryId, sleepQualityId]
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

// DELETE endpoint to delete a journal entry
app.delete("/api/entry/:entryId", authenticateToken, async (req, res) => {
  const entryId = req.params.entryId;
  console.log("entryId server.js line:401", entryId);
  const userId = req.cookies["my-token"];
  console.log("userId, server.js line:403 ", userId);

  if (!entryId) {
    return res.status(400).json({ error: "Entry ID is required" });
  }

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Fetch the photo URL before deleting the entry
      const photoResult = await client.query(
        "SELECT photo_url FROM daily_entry WHERE entry_id = $1 AND user_id = $2",
        [entryId, userId]
      );

      if (photoResult.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Entry not found or unauthorized" });
      }

      const photoUrl = photoResult.rows[0].photo_url;

      // Delete entry from entry_categories table
      await client.query(
        "DELETE FROM entry_categories WHERE daily_entry_id = $1",
        [entryId]
      );

      // Delete entry from daily_entry table
      await client.query(
        "DELETE FROM daily_entry WHERE entry_id = $1 AND user_id = $2",
        [entryId, userId]
      );

      await client.query("COMMIT");

      // Remove the photo file from the uploads folder
      if (photoUrl) {
        const photoPath = path.join(
          __dirname,
          "../uploads",
          path.basename(photoUrl)
        );
        fs.unlink(photoPath, (err) => {
          if (err) {
            console.error("Failed to delete photo:", err);
          }
        });
      }

      res.json({ message: "Entry deleted successfully" });
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error deleting entry:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* app.delete("/api/entry/:entryId", async (req, res) => {
  const entryId = req.params.entryId;
  console.log("Received DELETE request for entry ID:", entryId);

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    // Fetch the photo URL to delete the file
    const { rows } = await client.query(
      "SELECT photo_url FROM daily_entry WHERE entry_id = $1",
      [entryId]
    );
    const photoUrl = rows[0]?.photo_url;

    // Delete entry from entry_categories table
    await client.query(
      "DELETE FROM entry_categories WHERE daily_entry_id = $1",
      [entryId]
    );

    // Delete entry from daily_entry table
    await client.query("DELETE FROM daily_entry WHERE entry_id = $1", [
      entryId,
    ]);

    // Commit transaction
    await client.query("COMMIT");
    client.release();

    // Delete the photo file if it exists
    if (photoUrl) {
      const filePath = path.join(
        __dirname,
        "../uploads",
        path.basename(photoUrl)
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting entry:", error);
    res.status(500).json({ error: "Error deleting entry" });
  }
}); */

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
