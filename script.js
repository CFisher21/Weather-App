//Function to hit api (fetch)
function fetchData() {
    const apiKey = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cochrane%20alberta?unitGroup=metric&key=73ESG77VMVDHZPHKQ9YL7FNH4&contentType=json';
    return fetch(apiKey, { mode: 'cors'})
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
            const weatherIconsPath = './images/weather-icons/'
            const todayIconPath = weatherIconsPath + weatherData.days[0].icon + '.svg';
            const tonightIconPath = weatherIconsPath + weatherData.days[0].hours[20].icon + '.svg';
            //date
            document.getElementById('todays-date').innerText = weatherData.days[0].datetime
            //today
            document.getElementById('today-desc').innerText = weatherData.days[0].conditions;
            document.getElementById('today-temp').innerText = weatherData.days[0].temp
            document.getElementById('today-icon').src = todayIconPath
            //tonight
            document.getElementById('tonight-desc').innerText = weatherData.days[0].hours[20].conditions
            document.getElementById('tonight-temp').innerText = weatherData.days[0].hours[20].temp
            document.getElementById('tonight-icon').src = tonightIconPath
           
        } else {
            console.error('Error with weather data')
        }
    }).catch(error => {
        console.error('Error fetching data: ', error);
    })
}

function locationHeading() {
    fetchData()
    .then(weatherData => {
        if(weatherData) {
            const capitalize = weatherData.address.charAt(0).toUpperCase() + weatherData.address.slice(1).toLowerCase();
            document.getElementById('location-heading').innerHTML = capitalize
        } else {
            console.error('Error with weather data')
        }
    }).catch(error => {
        console.error('Error fetching data: ', error)
    })
}

function currentWeather() {
    fetchData()
    .then(weatherData => {
        if(weatherData) {
            document.getElementById('current-time').innerText = weatherData.currentConditions.datetime
        } else {
            console.error('error with weather data')
        }
    }).catch(error => {
        console.error('Error fetching data: ', error)
    })
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