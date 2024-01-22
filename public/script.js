// document.addEventListener("DOMContentLoaded", function () {
//     console.log("DOM content loaded");

//     var mymap;  // Declare the map variable

//     // Function to add a marker to the map
//     function addMarker(lat, lon, cityName) {
//         L.marker([lat, lon]).addTo(mymap)
//             .bindPopup(cityName)
//             .openPopup();
//     }

//     // Function to initialize the map
//     function initializeMap() {
//         mymap = L.map('mapContainer').setView([0, 0], 2);

//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             attribution: '© OpenStreetMap contributors'
//         }).addTo(mymap);
//     }

//     // Your existing code
//     document.querySelector('form').addEventListener('submit', function (event) {
//         event.preventDefault();
//         const cityName = document.querySelector('#cityName').value;
//         const weatherUrl = `/getWeather`; // Assuming you've set up a route for this in server.js

//         fetch(weatherUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ cityName }),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 const weather = data.weather;
//                 const coords = {
//                     latitude: weather.coord.lat,
//                     longitude: weather.coord.lon
//                 };

//                 if (!mymap) {
//                     // Initialize the map if it hasn't been initialized yet
//                     initializeMap();
//                 }

//                 // Add marker to the map for the specified city
//                 addMarker(coords.latitude, coords.longitude, cityName);

//                 // Display weather information and map
//                 displayWeatherInformation(weather);
//             })
//             .catch(error => console.error(error));
//     });

//     // Function to display weather information
//     function displayWeatherInformation(weather) {
//         const temp = weather.main.temp;
//         const feelsLike = weather.main.feels_like;
//         const humidity = weather.main.humidity;
//         const pressure = weather.main.pressure;
//         const windSpeed = weather.wind.speed;
//         const weatherDescription = weather.weather[0].description;
//         const rainVolume = weather.rain ? weather.rain['3h'] : 0;
//         const icon = weather.weather[0].icon;
//         const imageURL = "https://openweathermap.org/img/wn/" + icon +  "@2x.png";
//         const countryCode = weather.sys.country;

//         const responseHTML = `
//             <h1>Temperature in ${weather.name} is ${temp}°C</h1>
//             <h3>Feels like: ${feelsLike}°C</h3>
//             <p>Humidity: ${humidity}%</p>
//             <p>Pressure: ${pressure} hPa</p>
//             <p>Wind Speed: ${windSpeed} m/s</p>
//             <img src="${imageURL}" alt="weather icon">
//             <h3>The weather is currently ${weatherDescription}</h3>
//             <p>Coordinates: Latitude ${coords.latitude}, Longitude ${coords.longitude}</p>
//             <p>Country Code: ${countryCode}</p>
//             <p>Rain Volume (last 3 hours): ${rainVolume} mm</p>
//         `;

//         // Display the weather information
//         document.getElementById('weatherContainer').innerHTML = responseHTML;
//     }
// });
