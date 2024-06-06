// index.js
async function fetchSleepQualityData() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/sleep_quality"
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
      iconImg.src = `/Users/ina/Desktop/lighthouse/final/backend/src/public/images/${sleepQuality.icon}`;
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
    const response = await fetch("http://localhost:3000/api/activities");
    const data = await response.json();
    renderActivities(data);
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
   }
   function renderActivities(data) {
    const activitiesContainer = document.getElementById("activitiesContainer");
      data.forEach(activity => {
        const activityDiv = document.createElement("div");

        // Create an image element for the icon
        const iconImg = document.createElement("img");
        iconImg.src = `/Users/ina/Desktop/lighthouse/final/backend/src/public/images/${activity.icon}`;
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
    const response = await fetch("http://localhost:3000/api/emotion");
    const data = await response.json();
    renderEmotion(data);
    } catch (error) {
      console.error("Error fetching emotion data:", error);
    }
   }
   function renderEmotion(data) {
    const emotionContainer = document.getElementById("emotionContainer");
      data.forEach(emotion => {
        const emotionDiv = document.createElement("div");

        // Create an image element for the icon
        const iconImg = document.createElement("img");
        iconImg.src = `/Users/ina/Desktop/lighthouse/final/backend/src/public/images/${emotion.icon}`;
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
    const response = await fetch("http://localhost:3000/api/food");
    const data = await response.json();
    renderFood(data);
    } catch (error) {
      console.error("Error fetching foodata:", error);
    }
   }
   function renderFood(data) {
    const foodContainer = document.getElementById("foodContainer");
      data.forEach(food => {
        const foodDiv = document.createElement("div");

        // Create an image element for the icon
        const iconImg = document.createElement("img");
        iconImg.src = `/Users/ina/Desktop/lighthouse/final/backend/src/public/images/${food.icon}`;
        iconImg.alt = food.food_name;
        foodDiv.appendChild(iconImg);

        // Display the food name
        const foodName = document.createElement("p");
        foodName.textContent = food.food_name;
        foodDiv.appendChild(foodName);
        foodContainer.appendChild(foodDiv);
      });
    }

    fetchSleepQualityData();
    fetchActivityData();
    fetchEmotionData();
    fetchFoodData();