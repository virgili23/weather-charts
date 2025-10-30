// import "./style.css";

const apiKey = "c6401364e893ef48f3920bad850cadd0";
let processedData = [];
let myChart;
const iterations = 8;
const ctx = document.getElementById("myChart");

const inputField = document.querySelector("#location-field");
const addBtn = document.querySelector("#submit-button");
const weatherTitleField = document.querySelector(".weather-title");


let processData = (data) => {
  // fill the processed data array with all weather data
  for (let i = 0; i < data.list.length; i++) {
    const dt = data.list[i].dt;
    const localTime = new Date(dt * 1000);

    let toFarenheight = (temp) => {
      return Math.round(temp * (9 / 5) - 459.67);
    }

    const weatherTemp = toFarenheight(data.list[i].main.temp);
    const weatherTempMin = toFarenheight(data.list[i].main.temp_min);
    const weatherTempMax = toFarenheight(data.list[i].main.temp_max);

    const weatherHumidity = data.list[i].main.humidity;
    const weatherStatus = data.list[i].weather[0].description;
    const weatherIcon = data.list[i].weather[0].icon;

    const weatherTime = localTime.toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const weatherPressure = ((data.list[i].main.pressure) * 0.02953).toFixed(2);
    const weatherWind = Math.round((data.list[i].wind.speed) * 2.237);
    const weatherVisibility = ((data.list[i].visibility) * 0.000621371).toFixed(1);
    const weatherClouds = data.list[i].clouds.all;

    // const weatherRainChance = data.list[i].pop;

    processedData.push({
      weatherTemp,
      weatherTempMin,
      weatherTempMax,
      weatherHumidity,
      weatherStatus,
      weatherIcon,
      weatherTime,
      weatherPressure,
      weatherWind,
      weatherVisibility,
      weatherClouds
    });
  }

}

let chartGenerate = (iterations = 3) => {

  let processedInfo = [];

  for (let i = 0; i < iterations; i++) {
    processedInfo.push({
      x: processedData[i].weatherTime,
      y: processedData[i].weatherTemp,
      humidity: processedData[i].weatherHumidity,
      wind: processedData[i].weatherWind,
      pressure: processedData[i].weatherPressure
    });
  }

  // clear last one
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "line", // 'line', 'pie', 'doughnut', 'radar', etc.
    data: {
      datasets: [
        {
          label: "Weather Forecasts Every 3 Hours",
          // data needs an array
          data: processedInfo,
          pointRadius: 10,
          pointHoverRadius: 10,
          pointBorderWidth: 1,
          borderWidth: 3,
          backgroundColor: "rgba(11, 55, 79, 1)",
          borderColor: "rgba(11, 55, 79, 0.85)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0,0,0,0.75)',
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            title: function (context) {
              return `${context[0].raw.y}°`;
            },
            label: function (context) {
              const dataPoint = context.raw;
              return `Temp: ${dataPoint.y}°, Humidity: ${dataPoint.humidity}%, Wind: ${dataPoint.wind} mph`;
            }
          }
        }
      }
    },
  });
};

let cardGenerate = (iterations = 3) => {
  const infoContainer = document.querySelector(".s-weather-info");
  if (!infoContainer) return;
  infoContainer.innerHTML = '';

  for (let i = 0; i < iterations; i++) {

    const weatherCard = `
          <div class="s-weather-info__card">
            <button class="s-weather-info__button">
            <h2 class="s-weather-info__temp">
              <span>${processedData[i].weatherTemp}&deg;</span>
              <img src="https://openweathermap.org/img/wn/${processedData[i].weatherIcon}@2x.png" alt="icon" width="49px" height="49px"/>
            </h2>
            <p class="s-weather-info__time">${processedData[i].weatherTime}</p>
            <p class="s-weather-info__status">${processedData[i].weatherStatus}</p>
            </button>
            <div class="s-weather-info__content">
              <p>Humidity: ${processedData[i].weatherHumidity}%</p>
              <p>High/Low: ${processedData[i].weatherTempMax}&deg;/${processedData[i].weatherTempMin}&deg;</p>
              <p>Pressure: ${processedData[i].weatherPressure} in</p>
              <p>Visibility: ${processedData[i].weatherVisibility} mi</p>
              <p>Wind: ${processedData[i].weatherWind} mph</p>
              <p>Cloud Cover: ${processedData[i].weatherClouds}%</p>
              </div>
          </div>
          `;

    infoContainer.innerHTML += weatherCard;
  }

};

async function getData(location) {
  try {
    processedData = [];
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

    console.log(geoData[0]);

    weatherTitleField.textContent = `Weather Forecast for ${geoName}, ${geoState}, ${geoCountry}`;

    // weather section
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoLat}&lon=${geoLon}&appid=${apiKey}`;

    const weatherRes = await fetch(weatherUrl);

    if (!weatherRes.ok) {
      throw new Error(`Response Status: ${weatherRes.status}`);
    }

    const weatherData = await weatherRes.json();

    // console.log(`Weather URL for ${geoName}, ${geoState}: ${weatherUrl}`);

    processData(weatherData);

    // localStorage.setItem('data', processedData);
    // console.log(processedData);

    chartGenerate(iterations);
    cardGenerate(iterations);


    // Accordions
    const accordions = document.querySelectorAll('.s-weather-info__button');
    accordions.forEach((accordion) => {
      accordion.addEventListener('click', function () {
        this.classList.toggle('active');
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      })
    })

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
