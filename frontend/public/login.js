document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      //Promises
      //Fetch request
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.log(response.error);
        throw new Error("Login failed");
      }

      const data = await response.json();

      console.log("Login successful:", data);

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("window location", error);
      }

      // Store the JWT token in localStorage
      /* localStorage.setItem("token", data.token); */
    } catch (error) {
      console.error("Error logging in:", error);
    }
  });
