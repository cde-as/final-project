document.addEventListener("DOMContentLoaded", function () {
  fetchEmotions();
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
