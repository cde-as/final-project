CREATE TABLE daily_entry (
    entry_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    entry_date DATE NOT NULL,
    journal_entry TEXT,
    photo_url VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255)
);
