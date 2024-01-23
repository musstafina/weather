const express = require("express");
const https = require('https');
const bodyParser = require("body-parser");
const path = require('path');
const axios = require('axios');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, 'views')));

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
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 20px;">
                            <div style="width: 48%; border-right: 2px solid #ccc; padding-right: 20px;">
                                <h1>Temperature in ${cityName} is ${temp}°C</h1>
                                <h3>Feels like: ${feelsLike}°C</h3>
                                <p>Humidity: ${humidity}%</p>
                                <p>Pressure: ${pressure} hPa</p>
                                <p>Wind Speed: ${windSpeed} m/s</p>
                                <img src="${imageURL}" alt="weather icon" style="max-width: 100%; height: auto;">
                                <h3>The weather is currently ${weatherDescription}</h3>
                                <p>Coordinates: Latitude ${coords.latitude}, Longitude ${coords.longitude}</p>
                                <p>Country Code: ${countryCode}</p>
                                <p>Rain Volume (last 3 hours): ${rainVolume} mm</p>
                            </div>
                            <div style="width: 48%; padding-left: 20px;">
                                <div id="map" style="height: 500px; width: 100%;"></div>
                            </div>
                        </div>
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


const newsApiKey = '1567fb875a4f48ff80824a23999650a0'; 
const newsApiUrl = 'https://newsapi.org/v2/top-headlines?sources=bbc-news';

const nasaApiKey = 'gx4UUqR0d5fjbelmO7BkXoDXOj5bL4SmWfmf20CP'; 
const nasaApiUrl = 'https://api.nasa.gov/planetary/apod';

app.get("/news", async function (req, res) {
    try {
        const bbcNewsResponse = await axios.get(`${newsApiUrl}&sources=bbc-news&apiKey=${newsApiKey}`);
        const newsArticles = bbcNewsResponse.data.articles;
        res.render("news", { articles: newsArticles, source: "BBC News" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching news data");
    }
});

app.get("/nasa", async function (req, res) {
    try {
        const nasaResponse = await axios.get(`${nasaApiUrl}?api_key=${nasaApiKey}`);
        const nasaData = nasaResponse.data;
        res.render("nasa", { nasaData });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching NASA data");
    }
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});
