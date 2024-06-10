const user_id = "1";

async function fetchSleepQualityData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/sleep_quality?user_id=${user_id}`
    );
    const data = await response.json();
    renderSleepQuality(data);
  } catch (error) {
    console.error("Error fetching sleep quality data:", error);
  }
}

function renderSleepQuality(data) {
  const sleepQualityContainer = document.getElementById(
    "sleepQualityContainer"
  );
  data.forEach((sleepQuality) => {
    const sleepQualityDiv = document.createElement("div");

    // Create an image element for the icon
    const iconImg = document.createElement("img");
    /*    iconImg.src = `../backend/src/public/images/${sleepQuality.icon}`; */
    /* iconImg.src = `../backend/src/public/images/${sleepQuality.icon}`; */
    /*  iconImg.src = `/Users/chrisdea/Desktop/final-project/backend/src/public/images/${sleepQuality.icon}`; */
    iconImg.src = `/images/${sleepQuality.icon}`;
    iconImg.alt = sleepQuality.sleep_quality_name;
    sleepQualityDiv.appendChild(iconImg);

    // Display the sleep quality name
    const sleepQualityName = document.createElement("p");
    sleepQualityName.textContent = sleepQuality.sleep_quality_name;
    sleepQualityDiv.appendChild(sleepQualityName);
    sleepQualityContainer.appendChild(sleepQualityDiv);
  });
}

async function fetchActivityData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/activities?user_id=${user_id}`
    );
    const data = await response.json();
    renderActivities(data);
  } catch (error) {
    console.error("Error fetching activity data:", error);
  }
}
function renderActivities(data) {
  const activitiesContainer = document.getElementById("activitiesContainer");
  data.forEach((activity) => {
    const activityDiv = document.createElement("div");

    // Create an image element for the icon
    const iconImg = document.createElement("img");
    /* iconImg.src = `/Users/chrisdea/Desktop/final-project/backend/src/public/images/${activity.icon}`; */
    iconImg.src = `/images/${activity.icon}`;
    iconImg.alt = activity.activities_name;
    activityDiv.appendChild(iconImg);

    // Display the activity name
    const activityName = document.createElement("p");
    activityName.textContent = activity.activities_name;
    activityDiv.appendChild(activityName);
    activitiesContainer.appendChild(activityDiv);
  });
}

async function fetchEmotionData() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/emotion?user_id=${user_id}`
    );
    const data = await response.json();
    renderEmotion(data);
  } catch (error) {
    console.error("Error fetching emotion data:", error);
  }
}
function renderEmotion(data) {
  const emotionContainer = document.getElementById("emotionContainer");
  data.forEach((emotion) => {
    const emotionDiv = document.createElement("div");

    // Create an image element for the icon
    const iconImg = document.createElement("img");
    /* iconImg.src = `/Users/chrisdea/Desktop/final-project/backend/src/public/images/${emotion.icon}`; */
    iconImg.src = `/images/${emotion.icon}`;
    iconImg.alt = emotion.emotion_name;
    emotionDiv.appendChild(iconImg);

    // Display the emotion name
    const emotionName = document.createElement("p");
    emotionName.textContent = emotion.emotion_name;
    emotionDiv.appendChild(emotionName);
    emotionContainer.appendChild(emotionDiv);
  });
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

    // Create an image element for the icon
    const iconImg = document.createElement("img");
    /*  iconImg.src = `/Users/chrisdea/Desktop/final-project/backend/src/public/images/${food.icon}`; */
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

async function fetchDailyEntries() {
  try {
    const userId = 1;
    const response = await fetch(
      `http://localhost:3000/api/daily_entry?user_id=${user_id}`
    );
    console.log("Response status:", response.status); // Debug log
    const data = await response.json();
    console.log("Fetched data:", data); // Debug log
    renderDailyEntries(data);
  } catch (error) {
    console.error("Error fetching daily entries:", error);
  }
}

function renderDailyEntries(data) {
  const dailyEntriesContainer = document.getElementById(
    "dailyEntriesContainer"
  );
  dailyEntriesContainer.innerHTML = ""; // Clear previous entries
  data.forEach((entry) => {
    const entryDiv = document.createElement("div");

    const entryDate = document.createElement("p");
    entryDate.textContent = `Date: ${new Date(
      entry.entry_date
    ).toLocaleDateString()}`;
    entryDiv.appendChild(entryDate);

    const journalEntry = document.createElement("p");
    journalEntry.textContent = `Entry: ${entry.journal_entry}`;
    entryDiv.appendChild(journalEntry);

    if (entry.photo_url) {
      let photos = [];
      try {
        // Try to parse photo_url as JSON
        photos = JSON.parse(entry.photo_url);
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

    dailyEntriesContainer.appendChild(entryDiv);
  });
}

fetchSleepQualityData();
fetchActivityData();
fetchEmotionData();
fetchFoodData();
fetchDailyEntries();
