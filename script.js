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
let apiKey = "f744d3444bf106390752284211cc2a78";
let stateCode = "US-TX";
let countryCode = "US";
let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=32.77&lon=96.79&appid=" + apiKey;
// select everything that we are going to work with
let searchForm = document.querySelector('form');
let userInput = document.querySelector('.userInput');
let cityName = document.querySelector('#city-name');
let temperature = document.querySelector('.temperature');


searchForm.addEventListener('submit', function(event){
  event.preventDefault();
  var city = userInput.value;
  console.log(city);

  let geoCode = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "," + stateCode + "," + countryCode + "&limit=5&appid=" + apiKey;
  
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
      temperature.textContent = fahrenheit(weatherData) + "\u00B0";
      
    })
    .catch(function(error) {
      console.log("Error:", error);
      // let wind = weatherData[0]
    });
});

function fahrenheit(weatherData){
  let celsius = weatherData.list[0].main.temp;
  let convert = Math.round(celsius * 9/5) + 32;
  return convert;
}