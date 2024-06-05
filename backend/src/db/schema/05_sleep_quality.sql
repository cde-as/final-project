CREATE TABLE Sleep_Quality (
    sleep_quality_id SERIAL PRIMARY KEY,
    entry_categories_id INTEGER REFERENCES entry_categories(entry_categories_id),
    icon VARCHAR(255) NOT NULL,
    sleep_quality_name VARCHAR(50) NOT NULL
);