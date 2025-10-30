import "./style.css";

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

      weatherTitleField.textContent = `Weather Forecasts for ${geoName}, ${geoState}`;

      // weather section

      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${geoLat}&lon=${geoLon}&appid=${apiKey}`;

      const weatherRes = await fetch(weatherUrl);

      if (!weatherRes.ok) {
        throw new Error(`Response Status: ${weatherRes.status}`);
      }

      const weatherData = await weatherRes.json();

      // console.log(`Weather Data: ${weatherData}`);

      // processing weather data from the results
      // const processedWeatherData = (index) => {
      //   const dt = weatherData.list[index].dt;
      //   const localTime = new Date(dt * 1000);

      //   const weatherTemp = weatherData.list[index].main.temp;
      //   const weatherHumidity = weatherData.list[index].main.humidity;
      //   const weatherStatus = weatherData.list[index].weather[0].description;

      //   const timeString = localTime.toLocaleString("en-US", {
      //     weekday: "short",
      //     hour: "2-digit",
      //     minute: "2-digit",
      //     hour12: true,
      //   });

      //   return `
      //     Temp: ${weatherTemp}
      //     Humidity: ${weatherHumidity}
      //     Status: ${weatherStatus}
      //     Time: ${timeString}
      //     `;
      // };

      console.log(`Weather URL for ${geoName}, ${geoState}: ${weatherUrl}`);

      // fill the processed data array with all weather data
      for (let i = 0; i < weatherData.list.length; i++) {
        const dt = weatherData.list[i].dt;
        const localTime = new Date(dt * 1000);

        const weatherTemp = Math.round(
          weatherData.list[i].main.temp * (9 / 5) - 459.67
        );
        const weatherHumidity = weatherData.list[i].main.humidity;
        const weatherStatus = weatherData.list[i].weather[0].description;

        const weatherTime = localTime.toLocaleString("en-US", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        processedData.push({
          weatherTemp,
          weatherHumidity,
          weatherStatus,
          weatherTime,
        });
      }

      console.log(
        `Processed Data: `,
        JSON.stringify(processedData[0], null, 2)
      );

      // console.log(JSON.stringify(processedData, null, 2));

      // What to do with that data:

      const chartGenerate = (iterations) => {
        // process the data by separating them into arrays
        let processedHours = [];
        let processedTemps = [];

        for (let i = 0; i < iterations; i++) {
          processedHours.push(processedData[i].weatherTime);
          processedTemps.push(processedData[i].weatherTemp);
        }

        // console.log(processedHours);

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
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgb(75, 192, 192)",
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

      chartGenerate(8);

      const cardGenerate = (iterations) => {
        const infoContainer = document.querySelector(".c-weather-info");

        const weatherCard = `
        <button class="accordion">Section 1</button>
        <div class="panel">
          <p>Lorem ipsum...</p>
        </div>
        `;

        infoContainer.innerHTML += weatherCard;
      };

      cardGenerate();
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
