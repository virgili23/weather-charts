let processedData = [];

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

    localStorage.setItem("weather", JSON.stringify(processedData));
}

export { processData };