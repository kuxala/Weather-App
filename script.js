/* SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr) */

// Select HTML elements and assign them to variables for easier access.
const form = document.querySelector(".top-banner form"); // Select the form element inside an element with the class "top-banner" and store it in the "form" variable.
const input = document.querySelector(".top-banner input"); // Select the input element inside an element with the class "top-banner" and store it in the "input" variable.
const msg = document.querySelector(".top-banner .msg"); // Select an element with the class "msg" inside an element with the class "top-banner" and store it in the "msg" variable.
const list = document.querySelector(".ajax-section .cities"); // Select an element with the class "cities" inside an element with the class "ajax-section" and store it in the "list" variable.

/* SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up */
const apiKey = "bbd8f831e552847b0613ddfdeea2f193"; // Assign your OpenWeatherMap API key to the "apiKey" variable.

// Add an event listener to the form to handle form submissions.
form.addEventListener("submit", e => {
  e.preventDefault(); // Prevent the default form submission behavior, which would reload the page.

  // Get the value entered in the input field and store it in the "inputVal" variable.
  let inputVal = input.value;

  // Check if there's already a city in the list.
  const listItems = list.querySelectorAll(".ajax-section .city"); // Select all elements with the class "city" inside the element with the class "ajax-section" and store them in the "listItems" variable.
  const listItemsArray = Array.from(listItems); // Convert the selected elements to an array.

  if (listItemsArray.length > 0) { // Check if there are already city elements in the list.
    const filteredArray = listItemsArray.filter(el => { // Create a filtered array of elements based on a condition.
      let content = "";
      // Check if the input value contains a comma, indicating a comma-separated city name with a country code.
      if (inputVal.includes(",")) {
        // Check if the country code is too long (invalid); if so, keep only the first part (city name) of the input.
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          // Get the city name from the existing city element and convert it to lowercase.
          content = el.querySelector(".city-name span").textContent.toLowerCase();
        } else {
          // Get the city name (with country code) from the existing city element and convert it to lowercase.
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        // Input does not contain a comma, indicating a city name only.
        // Get the city name from the existing city element and convert it to lowercase.
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      // Compare the lowercase content with the lowercase input value to check for a match.
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) { // Check if any elements match the input value.
      // Display a message indicating that the city is already in the list, suggesting a more specific search by providing the country code.
      msg.textContent = `You already know the weather for ${filteredArray[0].querySelector(".city-name span").textContent} ...otherwise be more specific by providing the country code as well 😉`;
      form.reset(); // Reset the form.
      input.focus(); // Set focus on the input field.
      return; // Exit the event listener.
    }
  }

  // Construct the URL for the OpenWeatherMap API request using the input value and the API key.
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  // Make an API request to OpenWeatherMap to fetch weather data for the specified city.
  fetch(url) // Send an HTTP request to the specified URL.
    .then(response => response.json()) // Parse the response as JSON.
    .then(data => { // Handle the data from the response.
      // Extract relevant weather data from the response.
      const { main, name, sys, weather } = data;
      // Create a URL for the weather icon.
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

      // Create a new list item element to display the weather information for the city.
      const li = document.createElement("li");
      li.classList.add("city"); // Add the "city" class to the list item.

      // Define the HTML markup for the list item.
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span> 
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}"> 
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>
      `;

      // Set the HTML content of the list item to the defined markup.
      li.innerHTML = markup;

      // Add the list item to the list of cities.
      list.appendChild(li);
    })
    .catch(() => { // Handle any errors that may occur during the API request.
      // Display an error message if the city search is invalid.
      msg.textContent = "Please search for a valid city 😩";
    });

  // Clear any previous messages, reset the form, and set focus back to the input field.
  msg.textContent = "";
  form.reset();
  input.focus();
});



