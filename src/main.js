import "./style.css";


// Next Items:
// integrate timezone comparissons relative to where we are searching from.
// interactive weather map with leaflet and openweathermap "tile layer"

// For Fun:
// Learn more Tailwind and add those styles
// Revamp the design to one from dribbbl and use liquid glass effects
// Add more icons to weather statuses

import { titleGenerate } from "./modules/Title";
import { cardGenerate } from "./modules/Card";
import { chartGenerate } from "./modules/Chart";
import { processData } from "./modules/DataHandler";

const apiKey = "c6401364e893ef48f3920bad850cadd0";
const iterations = 8;
const inputField = document.querySelector("#location-field");
const addBtn = document.querySelector("#submit-button");

// Initial load
titleGenerate();
cardGenerate(iterations);
chartGenerate(iterations);

// Fetch Info
async function getData(location) {
  try {
    let locationInfo = [];

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(`Response status: ${geoResponse.status}`);
    }

    // Geo Section
    const geoData = await geoResponse.json();

    const {
      name: geoName,
      lat: geoLat,
      lon: geoLon,
      state: geoState,
      country: geoCountry,
    } = geoData[0];

    // console.log(geoData);

    locationInfo.push({
      geoName,
      geoState,
      geoCountry,
      geoLat,
      geoLon
    })

    localStorage.setItem("location", JSON.stringify(locationInfo));

    titleGenerate();


    // Weather Section
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoLat}&lon=${geoLon}&appid=${apiKey}`;

    const weatherRes = await fetch(weatherUrl);

    if (!weatherRes.ok) {
      throw new Error(`Response Status: ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();


    // Timezone Convertion Section

    const timeZoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${geoLat}%2C${geoLon}&timestamp=${weatherData.list[0].dt}&key=AIzaSyCVMlATFwwfIuSv9hd1Gw81tin1Y9MPOD4`;

    const timeZoneRes = await fetch(timeZoneUrl);
    if (!timeZoneRes.ok) {
      throw new Error(`Response Status: ${timeZoneRes.status}`);
    }
    const timeZoneData = await timeZoneRes.json();
    const timeZone = timeZoneData.timeZoneId;


    processData(weatherData, timeZone);
    chartGenerate(iterations);
    cardGenerate(iterations);

  } catch (error) {
    console.log(`Error message`);
    console.error(error.message);
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
