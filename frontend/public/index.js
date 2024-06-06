// index.js

async function fetchData() {
    try {
        const response = await fetch("http://localhost:3000/api/daily_entry");
        const data = await response.json();
        const entriesContainer = document.getElementById("entries-container");

        data.forEach(entry => {
            const entryDiv = document.createElement("div");

            // Display the journal entry text
            const entryText = document.createElement("p");
            entryText.textContent = entry.journal_entry;
            entryDiv.appendChild(entryText);

            // Display photos if available
            entry.photo_url.forEach(url => {
                const img = document.createElement("img");
                img.src = url;
                img.alt = "Photo";
                entryDiv.appendChild(img);
            });

            // Add a horizontal line to separate entries
            const hr = document.createElement("hr");
            entryDiv.appendChild(hr);

            entriesContainer.appendChild(entryDiv);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchData();
