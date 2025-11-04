import "./style.css";

import { cardGenerate } from "./modules/Card";
import { chartGenerate } from "./modules/Chart";
import { processData } from "./modules/DataHandler";


const apiKey = "c6401364e893ef48f3920bad850cadd0";
const iterations = 8;
const inputField = document.querySelector("#location-field");
const addBtn = document.querySelector("#submit-button");
const weatherTitleField = document.querySelector(".weather-title");


// Initial load
cardGenerate(iterations);
chartGenerate(iterations);


// Fetch Info
async function getData(location) {
  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;

    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error(`Response status: ${geoResponse.status}`);
    }

    // geo section
    const geoData = await geoResponse.json();

    const {
      name: geoName,
      lat: geoLat,
      lon: geoLon,
      state: geoState,
      country: geoCountry,
    } = geoData[0];


    if (geoCountry != 'US') {
      weatherTitleField.textContent = `Weather Forecast for ${geoName}, ${geoCountry}`;
    } else {
      weatherTitleField.textContent = `Weather Forecast for ${geoName}, ${geoState}, ${geoCountry}`;
    }

    // weather section
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoLat}&lon=${geoLon}&appid=${apiKey}`;

    const weatherRes = await fetch(weatherUrl);

    if (!weatherRes.ok) {
      throw new Error(`Response Status: ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();

    processData(weatherData);
    chartGenerate(iterations);
    cardGenerate(iterations);

  } catch (error) {
    console.error(error.message);
    console.log(`Error message`);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      }
    );
  }
}


// searchign weather handlers
let searchWeather = () => {
  const inputValue = inputField.value.trim();
  if (!inputValue) return;
  if (inputValue != "") {
    getData(inputValue);
    inputField.value = "";
  }
};

addBtn.addEventListener("click", searchWeather);
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// Accordions
document.querySelector(".s-weather-info").addEventListener("click", (e) => {
  const button = e.target.closest(".s-weather-info__button");
  if (!button) return;

  button.classList.toggle("active");
  const panel = button.nextElementSibling;
  panel.style.display = panel.style.display === "block" ? "none" : "block";
});
