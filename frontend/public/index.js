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

    fetchSleepQualityData();
    fetchActivityData();