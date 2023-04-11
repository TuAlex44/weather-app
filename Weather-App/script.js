// API end point
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
// URL prefix for weather icons
const WEATHER_ICON_PREFIX_URL = 'https://openweathermap.org/img/w';
const API_KEY = '69518b1f8f16c35f8705550dc4161056';

// logic for fetching and displaying data
async function handleWeather(city, latitude, longitude) {
  const search = document.querySelector('.searchBar');
  city = search.querySelector('.citySearch').value;
  const date = new Date().toLocaleTimeString('ro', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // loading indicator
  const loader = document.querySelector('.loading');

  document.querySelector(
    '.cityName',
  ).innerHTML = `Weather in ${city.toUpperCase()} la ora ${date}`;
  search.style.top = '0';

  loader.classList.add('display');
  const [weather, forecast] = await Promise.all([
    getWeather(city, latitude, longitude),
    getForecast(city, latitude, longitude),
  ]);

  loader.classList.remove('display');
  if (weather.cod !== 200 || forecast.cod !== '200') {
    handleError(weather);
    return;
  }

  city = weather.name;
  document.querySelector('.cityName',).innerHTML = `Weather in ${city.toUpperCase()} la ora ${date}`;

  document.querySelector('.weather').style.opacity = 1;
  document.querySelector('.forecast').style.opacity = 1;

  showWeather(weather);
  showForecast(forecast);
}

async function getUserLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  try {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      await handleWeather(undefined, latitude, longitude);
    });
  } catch (error) {
    alert("Unable to retrieve your location");
  }
}

async function getWeather(city, latitude, longitude) {
  const locationParam = city ? `q=${city}` : `lat=${latitude}&lon=${longitude}`;
  const data = await fetch(
    `${WEATHER_URL}?appid=${API_KEY}&units=metric&${locationParam}`,
  );
  return await data.json();
}

async function getForecast(city, latitude, longitude) {
  const locationParam = city ? `q=${city}` : `lat=${latitude}&lon=${longitude}`;
  const data = await fetch(
    `${FORECAST_URL}?appid=${API_KEY}&units=metric&${locationParam}`,
  );
  return await data.json();
}

function showWeather(weather) {
  const weatherIcon = document.querySelector('.weatherIcon');
  const degrees = document.querySelector('.degrees');
  const feelsLike = document.querySelector('.feelsLike');
  const tempMin = document.querySelector('.tempMin');
  const tempMax = document.querySelector('.tempMax');
  const wind = document.querySelector('.wind');
  const humidity = document.querySelector('.humidity');
  const pressure = document.querySelector('.pressure');

  weatherIcon.src = `${WEATHER_ICON_PREFIX_URL}/${weather.weather[0].icon}.png`;
  degrees.innerHTML = `${Math.round(weather.main.temp)} &#8451`;
  feelsLike.innerHTML = `Feels like: ${Math.round(
    weather.main.feels_like,
  )} &#8451`;
  tempMin.innerHTML = `Min. Temp.: ${Math.round(
    weather.main.temp_min,
  )} &#8451`;
  tempMax.innerHTML = `Max. Temp.: ${Math.round(
    weather.main.temp_max,
  )} &#8451`;
  wind.innerHTML = `Wind Speed: ${weather.wind.speed} m/s`;
  humidity.innerHTML = `Humidity: ${weather.main.humidity} %`;
  pressure.innerHTML = `Pressure: ${weather.main.pressure} hPa`;
}

function showForecast(forecast) {
  let table = '';
  forecast.list.forEach((f) => {
    const hour = f.dt_txt.substring(11, 16);
    const year = f.dt_txt.substring(0, 4);
    const month = f.dt_txt.substring(5, 7);
    const day = f.dt_txt.substring(8, 10);
    const weekDay = new Date(Date.UTC(year, month - 1, day));
    table += `<div>${weekDay.toLocaleDateString('en', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })} - ${hour}</div>`;
    table += `<div><img src="${WEATHER_ICON_PREFIX_URL}/${f.weather[0].icon}.png" /></div>`;
    table += `<div>${f.weather[0].description}</div>`;
    table += `<div>${Math.round(f.main.temp)} &#8451</div>`;
  });
  document.querySelector('.forecastTable').innerHTML = table;
}

function handleError({ cod, message }) {
  alert(`Something went wrong: ${cod} - ${message}`);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleWeather();
  }
});

// getting user location
document.addEventListener("DOMContentLoaded", () => {
  getUserLocation();
});
