CREATE TABLE photos (
    photo_id SERIAL PRIMARY KEY,
    daily_entry_id INTEGER REFERENCES daily_entry(entry_id),
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_url VARCHAR(255) NOT NULL
);
