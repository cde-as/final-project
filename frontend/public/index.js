// /* async function fetchEmotionData() {
//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/emotion?user_id=${user_id}`
//     );
//     const data = await response.json();
//     renderEmotion(data);
//   } catch (error) {
//     console.error("Error fetching emotion data:", error);
//   }
// }
// function renderEmotion(data) {
//   const emotionContainer = document.getElementById("emotionContainer");
//   data.forEach((emotion) => {
//     const emotionDiv = document.createElement("div");

//     // Create an image element for the icon
//     const iconImg = document.createElement("img");
//     iconImg.src = `/images/${emotion.icon}`;
//     iconImg.alt = emotion.emotion_name;
//     emotionDiv.appendChild(iconImg);

//     // Display the emotion name
//     const emotionName = document.createElement("p");
//     emotionName.textContent = emotion.emotion_name;
//     emotionDiv.appendChild(emotionName);
//     emotionContainer.appendChild(emotionDiv);
//   });
// } */
// async function fetchEmotionData() {
//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/emotion?user_id=${user_id}`
//     );
//     const data = await response.json();
//     return data; // Return emotion data
//   } catch (error) {
//     console.error("Error fetching emotion data:", error);
//     return []; // Return empty array in case of error
//   }
// }

// async function fetchFoodData() {
//   try {
//     const response = await fetch(
//       `http://localhost:3000/api/food?user_id=${user_id}`
//     );
//     const data = await response.json();
//     renderFood(data);
//   } catch (error) {
//     console.error("Error fetching food data:", error);
//   }
// }

// function renderFood(data) {
//   const foodContainer = document.getElementById("foodContainer");
//   data.forEach((food) => {
//     const foodDiv = document.createElement("div");

//     // Create an image element for the icon
//     const iconImg = document.createElement("img");
//     /*  iconImg.src = `/Users/chrisdea/Desktop/final-project/backend/src/public/images/${food.icon}`; */
//     iconImg.src = `/images/${food.icon}`;
//     iconImg.alt = food.food_name;
//     foodDiv.appendChild(iconImg);

//     // Display the food name
//     const foodName = document.createElement("p");
//     foodName.textContent = food.food_name;
//     foodDiv.appendChild(foodName);
//     foodContainer.appendChild(foodDiv);
//   });
// }

// /* async function fetchDailyEntries() {
//   try {
//     const userId = 1;
//     const response = await fetch(
//       `http://localhost:3000/api/daily_entry?user_id=${user_id}`
//     );
//     console.log("Response status:", response.status); // Debug log
//     const data = await response.json();
//     console.log("Fetched data:", data); // Debug log
//     renderDailyEntries(data);
//   } catch (error) {
//     console.error("Error fetching daily entries:", error);
//   }
// }

// function renderDailyEntries(data) {
//   const dailyEntriesContainer = document.getElementById(
//     "dailyEntriesContainer"
//   );
//   dailyEntriesContainer.innerHTML = ""; // Clear previous entries
//   data.forEach((entry) => {
//     const entryDiv = document.createElement("div");

//     const entryDate = document.createElement("p");
//     entryDate.textContent = `Date: ${new Date(
//       entry.entry_date
//     ).toLocaleDateString()}`;
//     entryDiv.appendChild(entryDate);

//     const journalEntry = document.createElement("p");
//     journalEntry.textContent = `Entry: ${entry.journal_entry}`;
//     entryDiv.appendChild(journalEntry);

//     if (entry.photo_url) {
//       let photos = [];
//       console.log("entry.photo_url:", entry.photo_url);
//       try {
//         // Try to parse photo_url as JSON
//         photos = JSON.parse(entry.photo_url);
//         console.log("Parsed photos:", photos);
//       } catch (e) {
//         // If parsing fails, treat photo_url as a single string
//         photos = [entry.photo_url];
//       }
//       photos.forEach((photo) => {
//         const photoImg = document.createElement("img");
//         photoImg.src = photo.startsWith("http")
//           ? photo
//           : `http://localhost:3000${photo}`;
//         photoImg.classList.add("entry-photo");
//         entryDiv.appendChild(photoImg);
//       });
//     }

//     dailyEntriesContainer.appendChild(entryDiv);
//   });
// } */
// document.addEventListener("DOMContentLoaded", function () {
//   fetchDailyEntries();
// });

// /* async function fetchDailyEntries() {
//   try {
//     const response = await fetch("/api/daily_entry?user_id=1");
//     const entries = await response.json();

//     const entriesContainer = document.getElementById("entries-container");
//     entries.forEach((entry) => {
//       const entryDiv = document.createElement("div");
//       entryDiv.classList.add("entry");

//       const entryHeader = document.createElement("h2");
//       entryHeader.textContent = "Date: " + entry.entry_date;
//       entryDiv.appendChild(entryHeader);

//       const emotionsDiv = document.createElement("div");
//       emotionsDiv.classList.add("emotions");
//       entry.emotions.forEach((emotionId) => {
//         const emotionSpan = document.createElement("span");
//         emotionSpan.textContent = "Emotion ID: " + emotionId;
//         emotionsDiv.appendChild(emotionSpan);
//       });
//       entryDiv.appendChild(emotionsDiv);

//       // Append the entry to the container
//       entriesContainer.appendChild(entryDiv);
//     });
//   } catch (error) {
//     console.error("Error fetching entries:", error);
//   }
// } */

// async function fetchDailyEntries() {
//   try {
//     const response = await fetch("/api/daily_entry?user_id=1");
//     const entries = await response.json();

//     // Fetch emotion data
//     const emotionResponse = await fetch(`/api/emotion?user_id=${user_id}`);
//     const emotionsData = await emotionResponse.json();

//     console.log("Fetched entries:", entries); // Log the fetched entries

//     const entriesContainer = document.getElementById("entries-container");
//     entries.forEach((entry) => {
//       console.log("Processing entry:", entry); // Log the current entry being processed
//       const entryDiv = document.createElement("div");
//       entryDiv.classList.add("entry");

//       const entryHeader = document.createElement("h2");
//       entryHeader.textContent = "Date: " + entry.entry_date;
//       entryDiv.appendChild(entryHeader);

//       // Check if the entry contains the emotions property before accessing it
//       if (entry.emotions && Array.isArray(entry.emotions)) {
//         const emotionsDiv = document.createElement("div");
//         emotionsDiv.classList.add("emotions");

//         // Filter emotions data for the current entry
//         const entryEmotions = emotionsData.filter((emotion) =>
//           entry.emotions.includes(emotion.id)
//         );

//         entryEmotions.forEach((emotion) => {
//           const emotionSpan = document.createElement("span");
//           emotionSpan.textContent = "Emotion: " + emotion.emotion_name;
//           emotionsDiv.appendChild(emotionSpan);
//         });

//         entryDiv.appendChild(emotionsDiv);
//       } else {
//         console.warn("Entry does not contain emotions property:", entry);
//       }

//       // Append the entry to the container
//       entriesContainer.appendChild(entryDiv);
//     });
//   } catch (error) {
//     console.error("Error fetching entries:", error);
//   }
// }

// fetchSleepQualityData();
// fetchActivityData();
// fetchEmotionData();
// fetchFoodData();
// fetchDailyEntries();
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
async function fetchDailyEntries() {
  try {
    const response = await fetch(`/api/daily_entry?user_id=${user_id}`);
    const entries = await response.json();
    console.log("Journal Entries:", entries);

    // Sort entries by date and time in descending order
    entries.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
    console.log("Journal Entries after sorting:", entries);

    // Fetch emotion data
    const emotionsData = await fetchEmotionData();
    console.log("Emotions Data 1:", emotionsData);

    //Clear the entries container before appending new entries
    const entriesContainer = document.getElementById("entries-container");
    entriesContainer.innerHTML = "";

    // Render each journal entry
    entries.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("entry");

      // Display date
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

      // Display associated emotion(s)
      if (entry.emotions && entry.emotions.length > 0) {
        const emotionsDiv = document.createElement("div");
        emotionsDiv.classList.add("emotions");

        // Debugging logs
        console.log("Entry Emotions:", entry.emotions);
        entry.emotions.forEach((emotionId) => {
          console.log("Emotion ID in Entry:", emotionId);
        });

        // Filter emotion data for the current entry
        const entryEmotions = emotionsData.filter((emotion) =>
          entry.emotions.includes(emotion.emotion_id)
        );
        console.log("Filtered Emotions for Entry:", entryEmotions);

        entryEmotions.forEach((emotion) => {
          // Create an emotion element
          const emotionDiv = document.createElement("div");

          // Create an image element for the icon
          const iconImg = document.createElement("img");
          iconImg.src = `/images/${emotion.icon}`;
          iconImg.alt = emotion.emotion_name;
          emotionDiv.appendChild(iconImg);

          console.log(
            `Appended Icon for Emotion: ${emotion.emotion_name}`,
            iconImg.src
          );

          // Display the emotion name
          const emotionName = document.createElement("p");
          emotionName.textContent = emotion.emotion_name;
          emotionDiv.appendChild(emotionName);
          console.log(`Appended Name for Emotion: ${emotion.emotion_name}`);

          emotionsDiv.appendChild(emotionDiv);
        });

        entryDiv.appendChild(emotionsDiv);
      }

      entriesContainer.appendChild(entryDiv);
    });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchSleepQualityData();
  fetchActivityData();
  fetchFoodData();
  fetchDailyEntries();
});
