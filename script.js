// Write the functions that hit the API. You’re going to want functions that can take a location and return the weather data for that location. For now, just console.log() the information.
// Write the functions that process the JSON data you’re getting from the API and return an object with only the data you require for your app.
// Set up a simple form that will let users input their location and will fetch the weather info (still just console.log() it).
// Display the information on your webpage!
// Add any styling you like!
// Optional: add a ‘loading’ component that displays from the time the form is submitted until the information comes back from the API. Use DevTools to test for low-end devices.
// Push that baby to github and share your solution below!

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
const apiKey = "f744d3444bf106390752284211cc2a78";
// let stateCode = "US-TX";
const countryCode = "US";
let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=32.77&lon=96.79&appid=" + apiKey;
// select everything that we are going to work with
const searchForm = document.querySelector('form');
const userInput = document.querySelector('.userInput');
const cityName = document.querySelector('#city-name');
const temperature = document.querySelector('.temperature');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
let index = 0;
let currentDayBox = document.querySelector('#current-time');
let currentDay = dayjs();
currentDayBox.textContent= currentDay.format("dddd, MMM DD");



searchForm.addEventListener('submit', function(event){
  event.preventDefault();
  var input = userInput.value;
  console.log(input);

  // Extract city and state from user input
  const inputArray = input.split(' ');
  const city = inputArray.slice(0, -1).join(' ');
  const stateCode = inputArray[inputArray.length - 1].toUpperCase();

  console.log("City:", city);
  console.log("State:", stateCode);

  // Validate state
  if (stateCode.length !== 2 || !isValidState(stateCode)) {
    alert("Please enter a valid two-letter state abbreviation.");
    return;
  }
   // Save user input to local storage
   saveToLocalStorage(city, stateCode);

  let geoCode = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "," + "US-" + stateCode + "," + countryCode + "&limit=5&appid=" + apiKey;
  
  fetch(geoCode)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      // Extract latitude and longitude from the data
      let latitude = data[0].lat;
      let longitude = data[0].lon;

      // Use the latitude and longitude as needed
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Call the weather API with the retrieved latitude and longitude
      let weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=" + apiKey;
      
      return fetch(weatherApiUrl);
    })
    .then(function(weatherResponcse){
      return weatherResponcse.json();
    })
    .then(function(weatherData){
      console.log(weatherData);
      console.log(weatherData.list[0].wind.speed)
      cityName.textContent = weatherData.city.name;
      temperature.textContent =": " + fahrenheit(weatherData) + "\u00B0";
      wind.textContent = ": "+ milesPerHour(weatherData);
      humidity.textContent = ": " + weatherData.list[0].main.humidity + "%"; 

      for(let i = 1; i<=5; i++){
        const forecastElement = document.querySelector(`#forecast-day-${1}`);

        forecastElement.querySelector('.temperature').textContent = '';
        forecastElement.querySelector('.wind').textContent = '';
        forecastElement.querySelector('.wind').textContent = '';
      }


      //I want to make a loop that writes text into each li
      //for each li 
      index=0;
      for(let i = 0; i < 5; i++){
        const forecastIndex = weatherData.list[index];
        const forecastElement = document.querySelector(`#forecast-day-${i + 1}`);
        const forecastTime = document.querySelector(`#day-${i +1}`);

        forecastElement.querySelector('.temperature').textContent = fahrenheitForForecast(forecastIndex) + "\u00B0";
        forecastElement.querySelector('.wind').textContent = milesPerHourForForecast(forecastIndex);
        forecastElement.querySelector('.humidity').textContent = forecastIndex.main.humidity + "%";
        index+=8;
        forecastTime.textContent= timeConversion(forecastIndex);
      }
      //text content = path in the json

    })
    .catch(function(error) {
      console.log("Error:", error);
    });
});

function fahrenheit(weatherData){
  let celsius = weatherData.list[0].main.temp;
  let convert = Math.round(celsius * 9/5) + 32;
  return convert;
};
function fahrenheitForForecast(forecastIndex) {
  if (forecastIndex && forecastIndex.main && forecastIndex.main.temp !== undefined) {
    let celsius = forecastIndex.main.temp;
    let convert = Math.round(celsius * 9/5) + 32;
    return convert;
  }
  return '';
}
function milesPerHour(weatherData){
  let mps = weatherData.list[0].wind.speed;
  let mph = (mps * 2.237).toFixed(2);
  return mph;
 
};
function milesPerHourForForecast(forecastIndex) {
  if (forecastIndex && forecastIndex.wind && forecastIndex.wind.speed !== undefined) {
    let mps = forecastIndex.wind.speed;
    let mph = (mps * 2.237).toFixed(2);
    return mph;
  }
  return '';
}
function timeConversion(forecastIndex){
  let time = dayjs(forecastIndex.dt_txt);
  return time.format("dddd, MMM DD");

}
// Function to validate state
function isValidState(state) {
  const validStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  return validStates.includes(state);
}

// Function to save user input to local storage
function saveToLocalStorage(city, state) {
  const userInputData = {
    city: city,
    state: state
  };

  localStorage.setItem('userInput', JSON.stringify(userInputData));
}