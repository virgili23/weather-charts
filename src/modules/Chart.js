let myChart;
const ctx = document.getElementById("myChart");

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
                        tension: 0.4
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

export { myChart, chartGenerate };