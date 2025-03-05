let weatherCache = {};
const weatherIconsPath = "./images/weather-icons/";
const suggestionsList = document.getElementById("suggestions");
const submitButton = document.getElementById("submit");
const searchBox = document.getElementById("search-box");
const radioUnit = document.querySelectorAll('input[name=unit]');

function getWeatherData(query, unitGroup) {
  const cacheKey = `${query}-${unitGroup}`;
  if (weatherCache[cacheKey]) {
    console.log("Using cached data for", cacheKey);
    return Promise.resolve(weatherCache[cacheKey]);
  } else {
    return fetchData(query, unitGroup).then((data) => {
      weatherCache[cacheKey] = data;
      return data;
    });
  }
}

//Function to hit api (fetch)
function fetchData(query, unitGroup) {
  const searchTerm2 = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=${unitGroup}&key=RLJXSY3WNACR2L3FD8PKBBEJP&contentType=json`
  return fetch(searchTerm2, { mode: "cors" })
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


function getCities(query) {
  return fetch(`https://photon.komoot.io/api/?q=${query}&limit=5`)
  .then((response) => {
    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return response.json();
  })
  .catch((error) => {
    console.log('Fetch error: ', error);
  })
}

function suggestCities() {
  getCities().then((citydata) => {
      console.log(citydata)
  })
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const handleInput = debounce(() => {
  const query = searchBox.value.trim();
  suggestionsList.innerHTML = '';

  if (query.length === 0) return;

  getCities(query)
    .then((data) => {
      if (data && data.features) {
        data.features.forEach((item) => {
          const li = document.createElement('li');
          const country = item.properties.country;
          const city = item.properties.name;
          const state = item.properties.state;
          const searchString = `${city} ${state} ${country}`
          li.innerText = searchString;
          li.addEventListener('click', () => {
            searchBox.value = searchString;
            suggestionsList.innerHTML = '';
          });
          suggestionsList.appendChild(li);
        });
      }
    })
    .catch((error) => {
      console.error('Error fetching city data:', error);
    });
}, 300); // Adjust delay as needed

searchBox.addEventListener('input', handleInput);

function updateWeather(query, unitGroup) {
    getWeatherData(query, unitGroup).then((weatherData) => {
      if (weatherData) {
        // Update location heading
        console.log(weatherData)
        document.getElementById("location-heading").innerText = weatherData.resolvedAddress;
        
        // Update today's weather UI
        if (weatherData.days[0]) {
          const todayHi = weatherData.days[0].tempmax;
          const todayLow = weatherData.days[0].tempmin;
          const todayAverageTemp = Math.round((todayHi + todayLow) / 2);
          const todayIconPath = weatherIconsPath + weatherData.days[0].icon + ".svg";
          const tomorrowIconPath = weatherIconsPath + weatherData.days[1].icon + ".svg";
          
          document.getElementById("todays-date").innerText = weatherData.days[0].datetime;
          document.getElementById("today-desc").innerText = weatherData.days[0].conditions;
          document.getElementById("today-avrg-temp").innerText = todayAverageTemp;
          document.getElementById("today-avrg-icon").src = todayIconPath;
          document.getElementById("tm-desc").innerText = weatherData.days[0].hours[20].conditions;
          document.getElementById("tm-temp").innerText = Math.round(weatherData.days[1].temp);
          document.getElementById("tm-icon").src = tomorrowIconPath;
        }
        
        // Update current weather UI
        const currentTime = weatherData.currentConditions.datetime;
        const twelveHourTime = convertTo12Hour(currentTime);
        const currentWeatherIcon = weatherIconsPath + weatherData.currentConditions.icon + ".svg";
        document.getElementById("visib").innerText = weatherData.currentConditions.visibility;
        document.getElementById("wind-gusts").innerText = Math.round(weatherData.currentConditions.windgust);
        document.getElementById("wind").innerText = Math.round(weatherData.currentConditions.windspeed);
        document.getElementById("current-time").innerText = twelveHourTime;
        document.getElementById("today-icon").src = currentWeatherIcon;
        document.getElementById("today-temp").innerText = Math.round(weatherData.currentConditions.temp);
        document.getElementById("today-real-feel").innerText = Math.round(weatherData.currentConditions.feelslike);
        
        // Hourly Weather 
        const hourly = document.getElementById('hourly')
        hourly.innerHTML = '';
        if(weatherData.days[0].hours[0]) {
          weatherData.days[0].hours.forEach((hour) => {
            
            const container = document.createElement('div');
            container.className = 'hours-container'

            const time = document.createElement('p'); 
            const convertedTime = convertTo12Hour(hour.datetime);
            time.innerText = convertedTime;

            const icon = document.createElement('img');
            icon.src = weatherIconsPath + hour.icon + '.svg';
            icon.alt = hour.icon;

            const temp = document.createElement('p');
            roundedTemp = Math.round(hour.temp)
            temp.innerText = roundedTemp;
            temp.className = 'temp-unit'

            const precip = document.createElement('p');
            roundedPrecip = Math.round(hour.precip)
            precip.innerText = roundedPrecip + '%'

            container.appendChild(time)
            container.appendChild(icon)
            container.appendChild(temp)
            container.appendChild(precip)

            hourly.appendChild(container)
            
          })
        }

        //10 Day weather forecast
        const tenDayContainer = document.getElementById('10day');
        tenDayContainer.innerHTML = '';
        if(weatherData.days) {
          let counter = 0
          weatherData.days.forEach((day) => {
            
            if(counter <= 9) {
              const container = document.createElement('div');
              const date = document.createElement('p');
              const icon = document.createElement('img');
              const temp = document.createElement('p');
              const desc = document.createElement('p');
              const precip = document.createElement('p');

              container.className = "tenday-container"

              const createDate = new Date(`${day.datetime}T00:00:00`);
              const formattedDate = createDate.toLocaleDateString('en-CA', { day: '2-digit', month: 'short' });
              date.innerText = formattedDate;
              date.classList = 'ten-day-date'

              icon.src = weatherIconsPath + day.icon + '.svg';

              const roundedTemp = Math.round(day.temp)
              temp.innerText = roundedTemp;
              temp.classList = 'ten-day-temp temp-unit'

              desc.innerText = day.description;
              desc.className = 'tenday-desc'
              
              const roundedPrecip = Math.round(day.precip)
              precip.innerText = roundedPrecip + '%'

              container.appendChild(date)
              container.appendChild(icon)
              container.appendChild(temp)
              container.appendChild(desc)
              container.appendChild(precip)

              tenDayContainer.appendChild(container);
              counter++
            }
          })
        }

        // Now update the UI for units
        if (unitGroup === 'metric') {
          applyMetricUnits();
        } else if (unitGroup === 'us') {
          applyUSUnits();
        } else {
          applyUKUnits();
        }
      } else {
        console.error("Error fetching weather data");
      }
    });
  }
  

  function applyMetricUnits() {
    const tempUnits = document.querySelectorAll('.temp-unit');
    const speedUnits = document.querySelectorAll('.speed-unit');
    
    tempUnits.forEach(tempunit => {
      tempunit.innerText = tempunit.innerText.replace(/[^\d.-]+$/, '') + ' C°';
    });
    
    speedUnits.forEach(speedunit => {
      speedunit.innerText = speedunit.innerText.replace(/[^\d.-]+$/, '') + ' km';
    });
  }
  
  function applyUSUnits() {
    const tempUnits = document.querySelectorAll('.temp-unit');
    const speedUnits = document.querySelectorAll('.speed-unit');
    
    tempUnits.forEach(tempunit => {
      tempunit.innerText = tempunit.innerText.replace(/[^\d.-]+$/, '') + ' F°';
    });
    
    speedUnits.forEach(speedunit => {
      speedunit.innerText = speedunit.innerText.replace(/[^\d.-]+$/, '') + ' mi';
    });
  }
  
  function applyUKUnits() {
    // Assuming UK uses Celsius for temperature and miles for wind speed, adjust as needed
    const tempUnits = document.querySelectorAll('.temp-unit');
    const speedUnits = document.querySelectorAll('.speed-unit');
    
    tempUnits.forEach(tempunit => {
      tempunit.innerText = tempunit.innerText.replace(/[^\d.-]+$/, '') + ' C°';
    });
    
    speedUnits.forEach(speedunit => {
      speedunit.innerText = speedunit.innerText.replace(/[^\d.-]+$/, '') + ' mi';
    });
  }
  

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    
    const currentRadio = document.querySelector('input[name="unit"]:checked');
    const unitGroup = currentRadio.value;
    const query = searchBox.value.trim();
    
    updateWeather(query, unitGroup);
  });
  

  radioUnit.forEach(radio => {
    radio.addEventListener('change', (event) => {
      const currentRadio = document.querySelector('input[name="unit"]:checked');
      const unitGroup = currentRadio.value;
      const currentLocation = document.getElementById('location-heading').innerText;
      // Re-use the existing query (currentLocation) with the new unitGroup
      updateWeather(currentLocation, unitGroup);
    });
  });
  

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

// Get the users current location to show local weather data
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toString();
      const longi = position.coords.longitude.toString();

      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${longi}&format=json`)
        .then(response => response.json())
        .then(data => {
          updateWeather(data.display_name, 'metric');
        });

    },
    (error) => {
      console.error("Error obtaining location", error);
    }
  );
} else {
  console.log("Geolocation is not supported by this browser.");
}

suggestCities();