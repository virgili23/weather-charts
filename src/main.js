import "./style.css";


// converting for loops into foreach
//


const apiKey = "c6401364e893ef48f3920bad850cadd0";
const iterations = 8;
const ctx = document.getElementById("myChart");

const inputField = document.querySelector("#location-field");
const addBtn = document.querySelector("#submit-button");
const weatherTitleField = document.querySelector(".weather-title");

let processedData = [];
let myChart;

let processData = (fullData) => {
  processedData = [];
  localStorage.clear();

  // fill the processed data array with all weather data

  const dataList = fullData.list;

  dataList.forEach(item => {
    const dt = item.dt;
    const localTime = new Date(dt * 1000);

    let toFarenheight = (temp) => {
      return Math.round(temp * (9 / 5) - 459.67);
    }

    const weatherTemp = toFarenheight(item.main.temp);
    const weatherTempMin = toFarenheight(item.main.temp_min);
    const weatherTempMax = toFarenheight(item.main.temp_max);

    const weatherHumidity = item.main.humidity;
    const weatherStatus = item.weather[0].description;
    const weatherIcon = item.weather[0].icon;

    const weatherTime = localTime.toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const weatherPressure = ((item.main.pressure) * 0.02953).toFixed(2);
    const weatherWind = Math.round((item.wind.speed) * 2.237);
    const weatherVisibility = ((item.visibility) * 0.000621371).toFixed(1);
    const weatherClouds = item.clouds.all;

    // For the wallpapers
    let weatherBackground;

    switch (weatherIcon) {
      case '01d':
        weatherBackground = '/assets/wallpapers/clear-sky-day.jpg';
        break;
      case '01n':
        weatherBackground = '/assets/wallpapers/clear-sky-night.jpeg';
        break;
      case '02d':
        weatherBackground = '/assets/wallpapers/few-clouds-day.jpg';
        break;
      case '02n':
        weatherBackground = '/assets/wallpapers/few-clouds-night.jpg';
        break;
      case '03d':
        weatherBackground = '/assets/wallpapers/few-clouds-day.jpg';
        break;
      case '03n':
        weatherBackground = '/assets/wallpapers/few-clouds-night.jpg';
        break;
      case '04d':
        weatherBackground = '/assets/wallpapers/few-clouds-day.jpg';
        break;
      case '04n':
        weatherBackground = '/assets/wallpapers/few-clouds-night.jpg';
        break;
      case '10d':
        weatherBackground = '/assets/wallpapers/raining-day.jpeg';
        break;
      case '10n':
        weatherBackground = '/assets/wallpapers/raining-day.jpeg';
        break;
      default:
        weatherBackground = '';
    }

    // const weatherRainChance = item.pop;

    processedData.push({
      weatherTemp,
      weatherTempMin,
      weatherTempMax,
      weatherHumidity,
      weatherStatus,
      weatherIcon,
      weatherBackground,
      weatherTime,
      weatherPressure,
      weatherWind,
      weatherVisibility,
      weatherClouds
    });

  });

  // console.log(processedData);

  localStorage.setItem("weather", JSON.stringify(processedData));
}

let chartGenerate = (iterations = 3) => {

  let weather = JSON.parse(localStorage.getItem("weather"));

  let processedInfo = [];

  if (!!weather) {
    for (let i = 0; i < iterations; i++) {
      processedInfo.push({
        x: weather[i].weatherTime,
        y: weather[i].weatherTemp,
        humidity: weather[i].weatherHumidity,
        wind: weather[i].weatherWind,
        pressure: weather[i].weatherPressure
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
            label: "Weather Every 3 Hours",
            // data needs an array
            data: processedInfo,
            pointRadius: 7,
            pointHoverRadius: 9,
            pointBorderWidth: 1,
            borderWidth: 3,
            backgroundColor: "rgba(214, 150, 23, 1)",
            borderColor: "rgba(214, 150, 23, .85)",
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
  }

};

let cardGenerate = (iterations = 3) => {
  const infoContainer = document.querySelector(".s-weather-info");
  let weather = JSON.parse(localStorage.getItem("weather"));

  if (!infoContainer) return;
  infoContainer.innerHTML = '';

  if (!!weather) {
    // console.log('not empty');

    for (let i = 0; i < iterations; i++) {

      // console.log(weather[i]);
      // !weather

      const weatherCard = `
      <div class="s-weather-info__card">
        <button class="s-weather-info__button" style="background-image: url('${weather[i].weatherBackground}');">
        <h2 class="s-weather-info__temp">
          <span>${weather[i].weatherTemp}&deg;</span>
          <img src="https://openweathermap.org/img/wn/${weather[i].weatherIcon}@2x.png" alt="icon" width="49px" height="49px"/>
        </h2>
        <p class="s-weather-info__time">${weather[i].weatherTime}</p>
        <p class="s-weather-info__status">${weather[i].weatherStatus}</p>
        </button>
        <div class="s-weather-info__content">
          <p>Humidity: ${weather[i].weatherHumidity}%</p>
          <p>High/Low: ${weather[i].weatherTempMax}&deg;/${weather[i].weatherTempMin}&deg;</p>
          <p>Pressure: ${weather[i].weatherPressure} in</p>
          <p>Visibility: ${weather[i].weatherVisibility} mi</p>
          <p>Wind: ${weather[i].weatherWind} mph</p>
          <p>Cloud Cover: ${weather[i].weatherClouds}%</p>
          </div>
      </div>
      `;

      infoContainer.innerHTML += weatherCard;

    }
  }
};


// Generate cards and charts on initial load
cardGenerate(iterations);
chartGenerate(iterations);


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

    // console.log(geoData[0]);


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

    // console.log(`Weather URL for ${geoName}, ${geoState}: ${weatherUrl}`);

    processData(weatherData);

    // console.log(processedData);

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
