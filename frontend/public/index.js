const user_id = "1";

async function fetchEmotionData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/emotion?user_id=${user_id}`
    );
    const data = await response.json();
    // Remove duplicates
    const uniqueData = removeDuplicates(data);
    console.log("Unique Emotion Data:", uniqueData);
    return uniqueData; // Return unique emotion data
  } catch (error) {
    console.error("Error fetching emotion data:", error);
    return []; // Return empty array in case of error
  }
}

async function fetchSleepQualityData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/sleep_quality?user_id=${user_id}`
    );
    const data = await response.json();
    console.log("Fetched sleep quality data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching sleep quality data:", error);
    return [];
  }
}

async function fetchActivityData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/activities?user_id=${user_id}`
    );
    const data = await response.json();
    console.log("Fetched activity data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return [];
  }
}

async function fetchFoodData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/food?user_id=${user_id}`
    );
    const data = await response.json();
    renderFood(data);
  } catch (error) {
    console.error("Error fetching food data:", error);
  }
}

function renderFood(data) {
  const foodContainer = document.getElementById("foodContainer");
  data.forEach((food) => {
    const foodDiv = document.createElement("div");
    const iconImg = document.createElement("img");
    iconImg.src = `/images/${food.icon}`;
    iconImg.alt = food.food_name;
    foodDiv.appendChild(iconImg);

    // Display the food name
    const foodName = document.createElement("p");
    foodName.textContent = food.food_name;
    foodDiv.appendChild(foodName);
    foodContainer.appendChild(foodDiv);
  });
}

function removeDuplicates(emotions) {
  const uniqueEmotions = [];
  const emotionIds = new Set();

  emotions.forEach((emotion) => {
    if (!emotionIds.has(emotion.emotion_id)) {
      uniqueEmotions.push(emotion);
      emotionIds.add(emotion.emotion_id);
    }
  });
  return uniqueEmotions;
}

async function fetchDailyEntries() {
  try {
    const [entries, emotionsData, sleepQualityData, activityData] =
      await Promise.all([
        fetch(`/api/daily_entry?user_id=${user_id}`).then((response) =>
          response.json()
        ),
        fetchEmotionData(),
        fetchSleepQualityData(),
        fetchActivityData(),
      ]);

    console.log("Journal Entries:", entries);
    console.log("Emotions Data:", emotionsData);
    console.log("Sleep Quality Data:", sleepQualityData);
    console.log("Activity Data:", activityData);

    // Sort entries by date and time in descending order
    entries.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
    console.log("Journal Entries after sorting:", entries);

    // Clear the entries container before appending new entries
    const entriesContainer = document.getElementById("entries-container");
    entriesContainer.innerHTML = "";

    // Render each journal entry
    entries.forEach((entry) => {
      console.log("Processing entry:", entry);
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("entry");

      const entryDate = document.createElement("p");
      entryDate.textContent = `Date: ${new Date(
        entry.entry_date
      ).toLocaleDateString()}`;
      entryDiv.appendChild(entryDate);

      // Display journal entry
      const journalEntry = document.createElement("p");
      journalEntry.textContent = `Entry: ${entry.journal_entry}`;
      entryDiv.appendChild(journalEntry);

      // Display photos
      if (entry.photo_url) {
        let photos = [];
        console.log("entry.photo_url:", entry.photo_url);
        try {
          // Try to parse photo_url as JSON
          photos = JSON.parse(entry.photo_url);
          console.log("Parsed photos:", photos);
        } catch (e) {
          // If parsing fails, treat photo_url as a single string
          photos = [entry.photo_url];
        }
        photos.forEach((photo) => {
          const photoImg = document.createElement("img");
          photoImg.src = photo.startsWith("http")
            ? photo
            : `http://localhost:3000${photo}`;
          photoImg.classList.add("entry-photo");
          entryDiv.appendChild(photoImg);
        });
      }

      // Display associated emotions
      if (entry.emotions && Array.isArray(entry.emotions)) {
        const emotionsDiv = document.createElement("div");
        emotionsDiv.classList.add("emotions");

        // Filter emotions data for the current entry
        const entryEmotions = emotionsData.filter((emotion) =>
          entry.emotions.includes(emotion.id)
        );

        entryEmotions.forEach((emotion) => {
          const emotionSpan = document.createElement("span");
          emotionSpan.textContent = "Emotion: " + emotion.emotion_name;
          emotionsDiv.appendChild(emotionSpan);
        });

        entryDiv.appendChild(emotionsDiv);
      } else {
        console.warn("Entry does not contain emotions property:", entry);
      }

      // Display associated sleep quality if available
      if (entry.sleepQuality && entry.sleepQuality.length > 0) {
        const sleepQualityId = entry.sleepQuality[0]; // Assuming only one sleep quality per entry

        const sleepQualityEntry = sleepQualityData.find(
          (sq) => sq.sleep_quality_id === sleepQualityId
        );

        if (sleepQualityEntry) {
          const sleepQualityDiv = document.createElement("div");
          sleepQualityDiv.classList.add("sleep-quality");

          // Create an image element for the icon
          const iconImg = document.createElement("img");
          iconImg.src = `/images/${sleepQualityEntry.icon}`;
          iconImg.alt = sleepQualityEntry.sleep_quality_name;
          sleepQualityDiv.appendChild(iconImg);

          const sleepQualityName = document.createElement("p");
          sleepQualityName.textContent = sleepQualityEntry.sleep_quality_name;
          sleepQualityDiv.appendChild(sleepQualityName);

          console.log("Sleep Quality for Entry:", sleepQualityEntry);

          entryDiv.appendChild(sleepQualityDiv);
        }
      }

      // Display associated activities
      if (entry.activities && entry.activities.length > 0) {
        console.log("Activities for Entry:", entry.activities);

        // Filter activity data for the current entry
        const entryActivities = activityData.filter((activity) =>
          entry.activities.includes(activity.activities_id)
        );
        console.log("Filtered Activities for Entry:", entryActivities);

        const activitiesDiv = document.createElement("div");
        activitiesDiv.classList.add("activities");

        entryActivities.forEach((activity) => {
          // Create an activity element
          const activityDiv = document.createElement("div");

          // Create an image element for the icon
          const iconImg = document.createElement("img");
          iconImg.src = `/images/${activity.activities_icon}`;
          iconImg.alt = activity.activities_name;
          activityDiv.appendChild(iconImg);

          // Display the activity name
          const activityName = document.createElement("p");
          activityName.textContent = activity.activities_name;
          activityDiv.appendChild(activityName);

          activitiesDiv.appendChild(activityDiv);
        });

        entryDiv.appendChild(activitiesDiv);
      }

      // Append the entry to the container
      entriesContainer.appendChild(entryDiv);
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchFoodData();
  fetchDailyEntries();
});
