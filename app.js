const express = require("express");
const https = require('https');
const bodyParser = require("body-parser");
const path = require('path');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
})


app.post("/", function (req, res) {
    const cityName = req.body.cityName;

    const weatherUrl = 
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b2984a6c500044dff2a8fc55eabd02be&units=metric`;
            https.get(weatherUrl, function (weatherResponse) {
                let response = "";
            
                weatherResponse.on("data", function (weatherData) {
                    response +=weatherData; 
                });
                weatherResponse.on("end", function () {
                    try {
                        const weather = JSON.parse(response);
                        const temp = weather.main.temp;
                        const feelsLike = weather.main.feels_like;
                        const humidity = weather.main.humidity;
                        const pressure = weather.main.pressure;
                        const windSpeed = weather.wind.speed;
                        const weatherDescription = weather.weather[0].description;
                        const icon = weather.weather[0].icon;
                        const imageURL = 
                            "https://openweathermap.org/img/wn/" + icon +  "@2x.png";
                        const countryCode = weather.sys.country;
    
                        const rainVolume = weather.rain ? weather.rain['3h'] : 0;
                        const coords = {
                            latitude: weather.coord.lat,
                            longitude: weather.coord.lon
                        };
                        const responseHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="width: 48%;">
                                <h1>Temperature in ${cityName} is ${temp}°C</h1>
                                <h3>Feels like: ${feelsLike}°C</h3>
                                <p>Humidity: ${humidity}%</p>
                                <p>Pressure: ${pressure} hPa</p>
                                <p>Wind Speed: ${windSpeed} m/s</p>
                                <img src="${imageURL}" alt="weather icon">
                                <h3>The weather is currently ${weatherDescription}</h3>
                                <p>Coordinates: Latitude ${coords.latitude}, Longitude ${coords.longitude}</p>
                                <p>Country Code: ${countryCode}</p>
                                <p>Rain Volume (last 3 hours): ${rainVolume} mm</p>
                            </div>
                            <div style="width: 48%;">
                            <div id="map" style="height: 500px; width: 100%;"></div>
                            <script>
                                function initMap() {
                                    var map = new google.maps.Map(document.getElementById('map'), {
                                        center: { lat: ${coords.latitude}, lng: ${coords.longitude} },
                                        zoom: 8
                                    });
                                    var marker = new google.maps.Marker({
                                        position: { lat: ${coords.latitude}, lng: ${coords.longitude} },
                                        map: map,
                                        title: '${cityName}'
                                    });
                                }
                            </script>
                            <script async defer
                                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBQ0mTGSOqcn-s46bfzvJ_UsMlH-7ngeRM&callback=initMap">
                            </script>
                        `;

                        res.send(responseHTML);
                    } catch (error) {
                        console.error(error);
                        res.status(500).send("Server Error");
                    }                
                          
                });
        });

});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
