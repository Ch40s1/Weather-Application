
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
const previousCities = document.querySelector('#previous-cities');
// this is index for navigation array
let index = 0;
//uses dayjs to set time.
let currentDayBox = document.querySelector('#current-time');
let currentDay = dayjs();
currentDayBox.textContent = currentDay.format("dddd, MMM DD");

// function to create and append a previous city button
function createPreviousCityButton(city, stateCode) {
  // Check if a button with the same city and state code already exists
  const existingButton = Array.from(previousCities.children).find(button => {
    const buttonCity = button.textContent.split(' ')[0];
    const buttonStateCode = button.textContent.split(' ')[1];
    return buttonCity === city && buttonStateCode === stateCode;
  });

  // If an existing button is found, return without creating a new button
  if (existingButton) {
    return;
  }

  const previousCityButton = document.createElement('button');
  previousCityButton.textContent = city + ' ' + stateCode;

  previousCityButton.addEventListener('click', function () {
    userInput.value = city + ' ' + stateCode;
    searchForm.dispatchEvent(new Event('submit'));
  });

  previousCities.appendChild(previousCityButton);
}

// Load user input from local storage and create buttons on page load
window.addEventListener('load', function () {
  if (localStorage.getItem('userInput')) {
    const userInputData = JSON.parse(localStorage.getItem('userInput'));
    const city = userInputData.city;
    const stateCode = userInputData.state;

    createPreviousCityButton(city, stateCode);
  }
  // Display a popup message
  window.alert('Hello! Welcome to my weather forecast. \nSearch a city name and use a state abbreviation. \nEX: Use TX for texas\nClick OK to continue.');

});
// Clear previous cities
previousCities.innerHTML = '';



//this is essentially the main code. It handles the search and display.
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var input = userInput.value;
  //makes sure that the input is there
  console.log(input);

  // Extract city and state from user input
  const inputArray = input.split(' ');
  const city = inputArray.slice(0, -1).join(' ');
  const stateCode = inputArray[inputArray.length - 1].toUpperCase();

  // Validate statecode
  if (stateCode.length !== 2 || !isValidState(stateCode)) {
    alert("Please enter a valid two-letter state abbreviation.");
    return;
  }
  // Save user input to local storage
  saveToLocalStorage(city, stateCode);

  // Append the previous city button to the previousCities element
  createPreviousCityButton(city, stateCode);
  //this is the url for the five day forecast.
  let geoCode = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + "US-" + stateCode + "," + countryCode + "&limit=5&appid=" + apiKey;
  //fetch api for five day forecast
  fetch(geoCode)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // Extract latitude and longitude from the data
      let latitude = data[0].lat;
      let longitude = data[0].lon;

      // Call the weather API with the retrieved latitude and longitude
      let weatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=" + apiKey;

      return fetch(weatherApiUrl);
    })
    .then(function (weatherResponcse) {
      return weatherResponcse.json();
    })
    //after everything is set. Set find path and get info.
    .then(function (weatherData) {
      //used to find path.
      console.log(weatherData);
      console.log(weatherData.list[0].wind.speed)
      cityName.textContent = weatherData.city.name;
      temperature.textContent = ": " + fahrenheit(weatherData) + "\u00B0";
      wind.textContent = ": " + milesPerHour(weatherData);
      humidity.textContent = ": " + weatherData.list[0].main.humidity + "%";
      //loop for getting all classes of the forecaset days.
      for (let i = 1; i <= 5; i++) {
        const forecastElement = document.querySelector(`#forecast-day-${1}`);
        //gets the class of the current id
        forecastElement.querySelector('.temperature').textContent = '';
        forecastElement.querySelector('.wind').textContent = '';
        forecastElement.querySelector('.wind').textContent = '';
      }
      // Sets index to 0
      index = 0;
      // Loop for setting text content to all five boxes.
      for (let i = 0; i < 5; i++) {
        const forecastIndex = weatherData.list[index];
        const forecastElement = document.querySelector(`#forecast-day-${i + 1}`);
        const forecastTime = document.querySelector(`#day-${i + 1}`);
        // Sets the text content but first convert the units to the ones needed
        forecastElement.querySelector('.temperature').textContent = fahrenheitForForecast(forecastIndex) + "\u00B0";
        forecastElement.querySelector('.wind').textContent = milesPerHourForForecast(forecastIndex);
        forecastElement.querySelector('.humidity').textContent = forecastIndex.main.humidity + "%";
        index += 8;
        forecastTime.textContent = timeConversion(forecastIndex);
      }

    })
    .catch(function (error) {
      console.log("Error:", error);
    });
});



////////////////////////////////////////////////////////////////////////////////////////////
// this sextion is equestions for converting units to the normal units used
////////////////////////////////////////////////////////////////////////////////////////////
function fahrenheit(weatherData) {
  let celsius = weatherData.list[0].main.temp;
  let convert = Math.round(celsius * 9 / 5) + 32;
  return convert;
};
//for foecast days
function fahrenheitForForecast(forecastIndex) {
  if (forecastIndex && forecastIndex.main && forecastIndex.main.temp !== undefined) {
    let celsius = forecastIndex.main.temp;
    let convert = Math.round(celsius * 9 / 5) + 32;
    return convert;
  }
  return '';
}
function milesPerHour(weatherData) {
  let mps = weatherData.list[0].wind.speed;
  let mph = (mps * 2.237).toFixed(2);
  return mph;

};
//for forecast days
function milesPerHourForForecast(forecastIndex) {
  if (forecastIndex && forecastIndex.wind && forecastIndex.wind.speed !== undefined) {
    let mps = forecastIndex.wind.speed;
    let mph = (mps * 2.237).toFixed(2);
    return mph;
  }
  return '';
}
function timeConversion(forecastIndex) {
  let time = dayjs(forecastIndex.dt_txt);
  return time.format("dddd, MMM DD");

}
// Function to validate
function isValidState(state) {
  //all 50 states :.(
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
