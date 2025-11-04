
let titleGenerate = () => {
    const weatherTitleField = document.querySelector(".weather-title");
    let locationStorage = JSON.parse(localStorage.getItem("location"));


    if (!!locationStorage) {
        if (locationStorage[0].geoCountry != 'US') {
            weatherTitleField.textContent = `Weather Forecast for ${locationStorage[0].geoName}, ${locationStorage[0].geoCountry}`;
        } else {
            weatherTitleField.textContent = `Weather Forecast for ${locationStorage[0].geoName}, ${locationStorage[0].geoState}, ${locationStorage[0].geoCountry}`;
        }
    } else {
        weatherTitleField.textContent = 'Weather Search';
    }
}

export { titleGenerate };