//Function to hit api (fetch)
function fetchData() {
    const apiKey = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/cochrane%20alberta?unitGroup=us&key=73ESG77VMVDHZPHKQ9YL7FNH4&contentType=json';
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

function displayDesc() {
    fetchData()
    .then(weatherData => {
        console.log(weatherData.days[0]);
        if(weatherData && weatherData.days && weatherData.days[0]) {
            document.getElementById('description').innerText = weatherData.days[0].description;
        } else {
            console.error('weatherData does not contain description')
        }
    }).catch(error => {
        console.error('Error fetching data: ', error);
    })
}    

displayDesc();
//Function to process the api 

//Form for user to get weather based on location

// Add a loading screen from when the form is hit to when the api is displayed on the page