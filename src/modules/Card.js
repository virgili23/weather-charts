let cardGenerate = (iterations = 3) => {
    const infoContainer = document.querySelector(".s-weather-info");
    let weather = JSON.parse(localStorage.getItem("weather"));

    if (!infoContainer) return;
    infoContainer.innerHTML = '';

    if (!!weather) {

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

export { cardGenerate };