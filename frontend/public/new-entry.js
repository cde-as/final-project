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
