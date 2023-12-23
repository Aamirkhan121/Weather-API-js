const cityInput = document.querySelector(".city-input")
const searchButton = document.querySelector(".search-btn")
const API_KEY = "f17d6e2bb32467e79b12657cf75dca2b";
const currentWeatherDiv = document.querySelector(".current-weather")
const weatherCardsDiv = document.querySelector(".weather-card")

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {  //html for the main weather card
        return `  <div class="details">
                        <h3>${cityName}((${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                      </div>
                      <div class="icon">
                      <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h5>${weatherItem.weather[0].description}</h5>
                      </div>`
    }
    else {  //html for the other five days forecast card
        return `          <li class="card">
                           <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                        </li>`
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {


        const uniForecastDate = []
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniForecastDate.includes(forecastDate)) {
                return uniForecastDate.push(forecastDate);
            }
        })
        //clearing previous weather data
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";

        //creating weather card and add to the dom
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            else {

                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });

    }).catch(() => {
        alert("An error occured while fetching the forecaste!")
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //Get user entered city name and remove extra space
    if (!cityName) return; //Return if cityName is empty 

    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
    fetch(URL).then(res => res.json()).then(data => {

        if (!data.length) return alert(`No condition found for ${API_KEY}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!")
    });
}

searchButton.addEventListener("click", getCityCoordinates)
