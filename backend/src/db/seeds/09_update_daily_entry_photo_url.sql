-- Correct photo_url field in the daily_entry table

UPDATE daily_entry SET photo_url = '["https://images.pexels.com/photos/163255/sunrise-sun-morgenrot-skies-163255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]' WHERE entry_id = 1;
UPDATE daily_entry SET photo_url = '["https://images.pexels.com/photos/554609/pexels-photo-554609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/1070492/pexels-photo-1070492.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]' WHERE entry_id = 2;
UPDATE daily_entry SET photo_url = '["https://images.pexels.com/photos/1269033/pexels-photo-1269033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]' WHERE entry_id = 3;
UPDATE daily_entry SET photo_url = '["https://images.pexels.com/photos/2193600/pexels-photo-2193600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "https://images.pexels.com/photos/7283551/pexels-photo-7283551.jpeg?auto=compress&cs=tinysrgb&w=800"]' WHERE entry_id = 4;
UPDATE daily_entry SET photo_url = '["https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=800"]' WHERE entry_id = 5;
UPDATE daily_entry SET photo_url = '["https://images.pexels.com/photos/3808243/pexels-photo-3808243.jpeg?auto=compress&cs=tinysrgb&w=800"]' WHERE entry_id = 6;
UPDATE daily_entry SET photo_url = '["https://images.pexels.com/photos/9931032/pexels-photo-9931032.jpeg?auto=compress&cs=tinysrgb&w=800"]' WHERE entry_id = 7;
