// import "./style.css";

const apiKey = "c6401364e893ef48f3920bad850cadd0";
let processedData = [];
let myChart;

document.addEventListener("DOMContentLoaded", () => {
  // const fullUrl =
  //   "https://api.openweathermap.org/geo/1.0/direct?q=28210&limit=5&appid=c6401364e893ef48f3920bad850cadd0";

  const ctx = document.getElementById("myChart");

  const inputField = document.querySelector("#location-field");
  const addBtn = document.querySelector("#submit-button");
  const weatherTitleField = document.querySelector(".weather-title");

  async function getData(location) {
    try {
      processedData = [];
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${apiKey}`;

      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) {
        throw new Error(`Response status: ${geoResponse.status}`);
      }

      const geoData = await geoResponse.json();

      const {
        name: geoName,
        lat: geoLat,
        lon: geoLon,
        state: geoState,
      } = geoData[0];

      weatherTitleField.textContent = `Weather Forecast for ${geoName}, ${geoState}`;

      // weather section

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoLat}&lon=${geoLon}&appid=${apiKey}`;

      const weatherRes = await fetch(weatherUrl);

      if (!weatherRes.ok) {
        throw new Error(`Response Status: ${weatherRes.status}`);
      }

      const weatherData = await weatherRes.json();


      console.log(`Weather URL for ${geoName}, ${geoState}: ${weatherUrl}`);

      // fill the processed data array with all weather data
      for (let i = 0; i < weatherData.list.length; i++) {
        const dt = weatherData.list[i].dt;
        const localTime = new Date(dt * 1000);

        let toFarenheight = (temp) => {
          return Math.round(temp * (9 / 5) - 459.67);
        }

        const weatherTemp = toFarenheight(weatherData.list[i].main.temp);
        const weatherTempMin = toFarenheight(weatherData.list[i].main.temp_min);
        const weatherTempMax = toFarenheight(weatherData.list[i].main.temp_max);

        const weatherHumidity = weatherData.list[i].main.humidity;
        const weatherStatus = weatherData.list[i].weather[0].description;
        const weatherIcon = weatherData.list[i].weather[0].icon;

        const weatherTime = localTime.toLocaleString("en-US", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });


        // const weatherRainChance = weatherData.list[i].pop;

        const weatherPressure = ((weatherData.list[i].main.pressure) * 0.02953).toFixed(2);
        const weatherWind = Math.round((weatherData.list[i].wind.speed) * 2.237);
        const weatherVisibility = Math.round((weatherData.list[i].visibility) * 0.000621371);
        const weatherClouds = weatherData.list[i].clouds.all;


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

      console.log(
        `Processed Data: `,
        JSON.stringify(processedData[0], null, 2)
      );


      // What to do with that data:

      const chartGenerate = (iterations) => {
        // process the data by separating them into arrays
        let processedHours = [];
        let processedTemps = [];

        for (let i = 0; i < iterations; i++) {
          processedHours.push(processedData[i].weatherTime);
          processedTemps.push(processedData[i].weatherTemp);
        }

        if (myChart) {
          myChart.destroy();
        }

        myChart = new Chart(ctx, {
          type: "line", // 'line', 'pie', 'doughnut', 'radar', etc.
          data: {
            // labels: ["Set 1", "Set 2", "Set 3", "Set 4"],
            labels: processedHours,
            datasets: [
              {
                label: "Weather Forecasts Every 3 Hours",
                // data: [12, 19, 3, 5],
                data: processedTemps,
                borderWidth: 1,
                backgroundColor: "rgba(57, 171, 82, 0.5)",
                borderColor: "rgba(57, 171, 82, 0.5)",
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
          },
        });
      };
      // Generating passed number of iterations
      chartGenerate(8);

      const cardGenerate = (iterations) => {
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
                </div>
            </div>
            `;

          infoContainer.innerHTML += weatherCard;
        }

      };
      // with iterations while i decide how many to pass
      cardGenerate(5);


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
});
