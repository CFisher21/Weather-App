// Global variables
const weatherIconsPath = "./images/weather-icons/";
const suggestionsList = document.getElementById("suggestions");
const submitButton = document.getElementById("submit");
const searchBox = document.getElementById("search-box");

//Function to hit api (fetch)
function fetchData(query) {
  const searchTerm = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=metric&key=73ESG77VMVDHZPHKQ9YL7FNH4&contentType=json`;
  return fetch(searchTerm, { mode: "cors" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.log("Fetch error: ", error);
    });
}

// Function to fetch city suggestions
async function fetchCities(query) {
  await fetch(
    `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`
  )
    .then((response) => response.json())
    .then((data) => {
      suggestionsList.innerText = "";
      data.forEach((place) => {
        const listItem = document.createElement("li");
        let key = place.addresstype
        const city = place.address[key]
        const state = place.address.state || "Unknown State";
        const country = place.address.country || "Unknown Country";
        const locData = `${city} ` + `${state} ` + `${country} `;
        listItem.innerText = locData;
        suggestionsList.appendChild(listItem);
        listItem.addEventListener('click', () => {
            searchBox.value = listItem.innerText
        })
      });
    });
}

// Event listener for input changes
searchBox.addEventListener("input", () => {
    setTimeout(() => {
        const query = searchBox.value.trim();
        fetchCities(query);
    }, 1000)
  
});

submitButton.addEventListener("click", (event) => {
  const searchBox = document.getElementById("search-box");
  console.log(searchBox.value);
  event.preventDefault();
  const query = searchBox.value.trim();
  todayWeather(query);
  locationHeading(query);
  currentWeather(query);
});

function locationHeading(query) {
  fetchData(query).then((weatherData) => {
    if (weatherData) {
      //const capitalize = weatherData.address.charAt(0).toUpperCase() + weatherData.address.slice(1).toLowerCase();
      document.getElementById("location-heading").innerHTML =
        weatherData.resolvedAddress;
    } else {
      console.error("Error with location heading");
    }
  });
}

function todayWeather(query) {
  fetchData(query).then((weatherData) => {
    if (weatherData && weatherData.days[0]) {
      const todayHi = weatherData.days[0].tempmax;
      const todayLow = weatherData.days[0].tempmin;
      const todayAverageTemp = Math.round((todayHi + todayLow) / 2);
      const todayIconPath =
        weatherIconsPath + weatherData.days[0].icon + ".svg";
      const tomorrowIconPath =
        weatherIconsPath + weatherData.days[1].icon + ".svg";
      //date
      document.getElementById("todays-date").innerText =
        weatherData.days[0].datetime;
      //today
      document.getElementById("today-desc").innerText =
        weatherData.days[0].conditions;
      document.getElementById("today-avrg-temp").innerText = todayAverageTemp;
      document.getElementById("today-avrg-icon").src = todayIconPath;
      //tonight
      document.getElementById("tm-desc").innerText =
        weatherData.days[0].hours[20].conditions;
      document.getElementById("tm-temp").innerText = Math.round(
        weatherData.days[1].temp
      );
      document.getElementById("tm-icon").src = tomorrowIconPath;
    } else {
      console.error("Error with weather data");
    }
  });
}

function currentWeather(query) {
  fetchData(query).then((weatherData) => {
    if (weatherData) {
      const currentTime = weatherData.currentConditions.datetime;
      const twelveHourTime = convertTo12Hour(currentTime);
      const currentWeatherIcon =
        weatherIconsPath + weatherData.currentConditions.icon + ".svg";

      document.getElementById("visib").innerText =
        weatherData.currentConditions.visibility;
      document.getElementById("wind-gusts").innerText = Math.round(
        weatherData.currentConditions.windgust
      );
      document.getElementById("wind").innerText = Math.round(
        weatherData.currentConditions.windspeed
      );
      document.getElementById("current-time").innerText = twelveHourTime;
      document.getElementById("today-icon").src = currentWeatherIcon;
      document.getElementById("today-temp").innerText = Math.round(
        weatherData.currentConditions.temp
      );
      document.getElementById("today-real-feel").innerText = Math.round(
        weatherData.currentConditions.feelslike
      );
    } else {
      console.error("Error with current weather");
    }
  });
}

// Convert 24hr clock to 12hr clock
function convertTo12Hour(time24) {
  // Split the time string (e.g., "14:30") into hours and minutes
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr; // keep as string for formatting

  // Determine AM or PM
  const period = hour >= 12 ? "PM" : "AM";

  // Convert hour from 24-hour to 12-hour format
  hour = hour % 12 || 12; // if hour is 0 (midnight) or 12 (noon), this converts correctly

  // Return the formatted time
  return `${hour}:${minute} ${period}`;
}

// THIS FUNCTION TO BE REMOVED AFTER DEVELOPMENT
fetchData().then((weatherData) => {
  console.log("Weather Data: ", weatherData);
  console.log("day 0: ", weatherData.days[0]);
  console.log("hour 20: ", weatherData.days[0].hours[20]);
});

todayWeather();
locationHeading();
currentWeather();
//Function to process the api

//Form for user to get weather based on location

// Add a loading screen from when the form is hit to when the api is displayed on the page
