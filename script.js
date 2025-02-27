// Global variables
const weatherIconsPath = './images/weather-icons/'
//Function to hit api (fetch)
function fetchData() {
    const toronto = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/toronto?unitGroup=us&key=73ESG77VMVDHZPHKQ9YL7FNH4&contentType=json';
    const cochrane = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cochrane%20alberta?unitGroup=metric&key=73ESG77VMVDHZPHKQ9YL7FNH4&contentType=json';
    return fetch(cochrane, { mode: 'cors'})
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

function todayWeather() {
    fetchData()
    .then(weatherData => {
        if(weatherData && weatherData.days[0]) {
            const todayHi = weatherData.days[0].tempmax
            const todayLow = weatherData.days[0].tempmin
            const todayAverageTemp = Math.round((todayHi + todayLow) / 2)
            const todayIconPath = weatherIconsPath + weatherData.days[0].icon + '.svg';
            const tomorrowIconPath = weatherIconsPath + weatherData.days[1].icon + '.svg';
            //date
            document.getElementById('todays-date').innerText = weatherData.days[0].datetime
            //today
            document.getElementById('today-desc').innerText = weatherData.days[0].conditions;
            document.getElementById('today-avrg-temp').innerText = todayAverageTemp
            document.getElementById('today-avrg-icon').src = todayIconPath
            //tonight
            document.getElementById('tm-desc').innerText = weatherData.days[0].hours[20].conditions
            document.getElementById('tm-temp').innerText = Math.round(weatherData.days[1].temp)
            document.getElementById('tm-icon').src = tomorrowIconPath
           
        } else {
            console.error('Error with weather data')
        }
    })
}

function locationHeading() {
    fetchData()
    .then(weatherData => {
        if(weatherData) {
            const capitalize = weatherData.address.charAt(0).toUpperCase() + weatherData.address.slice(1).toLowerCase();
            document.getElementById('location-heading').innerHTML = capitalize
        } else {
            console.error('Error with location heading')
        }
    })
}

function currentWeather() {
    fetchData()
    .then(weatherData => {
        if(weatherData) {
            const currentTime = weatherData.currentConditions.datetime;
            const twelveHourTime = convertTo12Hour(currentTime);
            const currentWeatherIcon = weatherIconsPath + weatherData.currentConditions.icon + '.svg';

            document.getElementById('visib').innerText = weatherData.currentConditions.visibility;
            document.getElementById('wind-gusts').innerText = Math.round(weatherData.currentConditions.windgust);
            document.getElementById('wind').innerText = Math.round(weatherData.currentConditions.windspeed);
            document.getElementById('current-time').innerText = twelveHourTime;
            document.getElementById('today-icon').src = currentWeatherIcon;
            document.getElementById('today-temp').innerText = Math.round(weatherData.currentConditions.temp);
            document.getElementById('today-real-feel').innerText = Math.round(weatherData.currentConditions.feelslike)
        } else {
            console.error('Error with current weather')
        }
    })
}

// Convert 24hr clock to 12hr clock
function convertTo12Hour(time24) {
    // Split the time string (e.g., "14:30") into hours and minutes
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr; // keep as string for formatting

    // Determine AM or PM
    const period = hour >= 12 ? 'PM' : 'AM';

    // Convert hour from 24-hour to 12-hour format
    hour = hour % 12 || 12; // if hour is 0 (midnight) or 12 (noon), this converts correctly

    // Return the formatted time
    return `${hour}:${minute} ${period}`;
}

// THIS FUNCTION TO BE REMOVED AFTER DEVELOPMENT
fetchData()
.then(weatherData => {
    console.log('Weather Data: ', weatherData)
    console.log('day 0: ', weatherData.days[0]);
    console.log('hour 20: ', weatherData.days[0].hours[20]);
})  

todayWeather();
locationHeading();
currentWeather();
//Function to process the api 

//Form for user to get weather based on location

// Add a loading screen from when the form is hit to when the api is displayed on the page