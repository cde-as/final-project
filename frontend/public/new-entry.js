document.addEventListener("DOMContentLoaded", function () {
  fetchEmotions();
  fetchSleepQuality();
  fetchActivities();
});

async function fetchEmotions() {
  try {
    const response = await fetch("/api/emotions");
    const emotions = await response.json();
    console.log("Emotions fetched:", emotions);

    const emotionsSelect = document.getElementById("emotions");
    emotions.forEach((emotion) => {
      const option = document.createElement("option");
      option.value = emotion.emotion_id;
      option.textContent = emotion.emotion_name;
      emotionsSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching emotions:", error);
  }
}
async function fetchSleepQuality() {
  try {
    const response = await fetch("/api/new_sleep_quality");
    const sleepQuality = await response.json();
    console.log("Sleep Quality fetched:", sleepQuality);

    const sleepQualitySelect = document.getElementById("sleep-quality");
    sleepQuality.forEach((quality) => {
      const option = document.createElement("option");
      option.value = quality.sleep_quality_id;
      option.textContent = quality.sleep_quality_name;
      sleepQualitySelect.appendChild(option);
    });
    console.log(
      "Sleep Quality options populated:",
      sleepQualitySelect.innerHTML
    );
  } catch (error) {
    console.error("Error fetching sleep quality:", error);
  }
}

async function fetchActivities() {
  try {
    const response = await fetch("/api/new_activities");
    const activities = await response.json();
    console.log("Activities fetched:", activities);

    const activitiesSelect = document.getElementById("activities");
    activities.forEach((activity) => {
      const option = document.createElement("option");
      option.value = activity.activities_id;
      option.textContent = activity.activities_name;
      activitiesSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
}

document
  .getElementById("entry-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append(
      "journal_entry",
      document.getElementById("journal-entry").value
    );
    const photoInput = document.getElementById("photo");
    if (photoInput.files.length > 0) {
      formData.append("photo", photoInput.files[0]);
    }

    const selectedEmotions = Array.from(
      document.getElementById("emotions").selectedOptions
    ).map((option) => parseInt(option.value)); // Convert to integer

    if (!selectedEmotions.every(Number.isInteger)) {
      // Display an error message indicating that invalid emotion selection was made
      return;
    }

    selectedEmotions.forEach((emotionId) => {
      formData.append("emotion", emotionId);
    });
    console.log("Selected emotions:", selectedEmotions);

    // Get selected sleep quality
    const selectedSleepQuality = document.getElementById("sleep-quality").value;
    formData.append("sleep_quality", selectedSleepQuality);
    //console.log("Selected sleep quality:", sleep_quality_id);

    // Get selected activities
    const selectedActivities = Array.from(
      document.getElementById("activities").selectedOptions
    ).map((option) => parseInt(option.value));
    selectedActivities.forEach((activityId) => {
      formData.append("activity", activityId);
    });
    console.log("Selected activities:", selectedActivities);

    try {
      const response = await fetch("http://localhost:3000/api/entry", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Entry submitted:", data);
    } catch (error) {
      console.error("Error submitting entry:", error);
    }
  });
