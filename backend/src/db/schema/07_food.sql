CREATE TABLE Food (
    food_id SERIAL PRIMARY KEY,
    entry_categories_id INTEGER REFERENCES entry_categories(entry_categories_id),
    icon VARCHAR(255) NOT NULL,
    food_name VARCHAR(50) NOT NULL
);