const express = require("express");
const https = require('https');
const app = express();

app.get("/", function (req, res) {
    const url = 
        "https://api.openweathermap.org/data/2.5/weather?q=Astana&appid=b2984a6c500044dff2a8fc55eabd02be&units=metric";

    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);

            const temp = weatherData.main.temp;
            const feelsLike = weatherData.main.feels_like;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = 
                "https://openweathermap.org/img/wn/" + icon +  "@2x.png";
            const coordinates =`Latitude: ${weatherData.coord.lat}, Longitude: ${weatherData.coord.lon} `;
            const humidity = weatherData.main.humidity;
            const pressure = weatherData.main.pressure;
            const windSpeed = weatherData.wind.speed;
            const rainVolume = weatherData.rain;
            const countryCode = weatherData.sys.country;
            res.write(`<h1>Temperature is ${temp}C (Feels like ${feelsLike}C)</h1>`);
            res.write(`<h3>The weather is currently ${weatherDescription}</h3>`);
            res.write(`<img src="${imageURL}" alt="weather icon">`);
            res.write(`<p>${coordinates}</p>`);
            res.write(`<p>Humidity: ${humidity}%</p>`);
            res.write(`<p>Pressure: ${pressure} hPa</p>`);
            res.write(`<p>Wind Speed: ${windSpeed} m/s</p>`);
            res.write(`<p>Rain Volume (last 3 hours): ${rainVolume} mm</p>`);
            res.write(`<p>Country Code: ${countryCode}</p>`);
            res.send();
        });

    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
