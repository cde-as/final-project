SELECT 
    ec.entry_categories_id,
    de.entry_id AS daily_entry,
    a.activities_name AS activity,
    sq.sleep_quality_name AS sleep_quality,
    f.food_name AS food,
    m.mood_name AS mood,
    e.emotion_name AS emotion,
    ec.upload_time
FROM 
    entry_categories ec
JOIN 
    daily_entry de ON ec.daily_entry_id = de.entry_id
JOIN 
    activities a ON ec.activities_id = a.activities_id
JOIN 
    sleep_quality sq ON ec.sleep_quality_id = sq.sleep_quality_id
JOIN 
    food f ON ec.food_id = f.food_id
JOIN 
    mood m ON ec.mood_id = m.mood_id
JOIN 
    emotion e ON ec.emotion_id = e.emotion_id;