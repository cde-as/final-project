-- Create this table last

CREATE TABLE entry_categories (
    entry_categories_id SERIAL PRIMARY KEY,
    daily_entry_id INTEGER REFERENCES daily_entry(entry_id),
    activities_id INTEGER REFERENCES activities(activities_id),
    sleep_quality_id INTEGER REFERENCES sleep_quality(sleep_quality_id),
    food_id INTEGER REFERENCES food(food_id),
    mood_id INTEGER REFERENCES mood(mood_id),
    emotion_id INTEGER REFERENCES emotion(emotion_id),
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);