const result = document.getElementById("result");
const searchForm = document.getElementById("search-form");
const searchBtn = document.getElementById("search-btn");
const cityRef = document.getElementById("city");

const weatherIcons = {
  Thunderstorm: "⛈️",
  Drizzle: "🌦️",
  Rain: "🌧️",
  Snow: "❄️",
  Clear: "☀️",
  Clouds: "☁️",
  Mist: "🌫️",
  Smoke: "💨",
  Haze: "🌫️",
  Dust: "🏜️",
  Fog: "🌫️",
  Sand: "🏜️",
  Ash: "🌋",
  Squall: "🌬️",
  Tornado: "🌪️",
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const getWeatherIcon = (data) => {
  const condition = data.weather[0].main;
  const description = data.weather[0].description || "";
  const isNight = (data.weather[0].icon || "").endsWith("n");
  const windSpeed = data.wind && data.wind.speed ? data.wind.speed : 0;
  const isWindy =
    windSpeed >= 8 || /wind/i.test(description) || condition === "Squall";

  let icon = weatherIcons[condition] || "🌤️";

  if (condition === "Clear") {
    icon = isNight ? "🌙" : "☀️";
  } else if (condition === "Clouds") {
    icon = isNight ? "☁️" : "⛅";
  }

  if (isWindy && condition !== "Tornado" && condition !== "Squall") {
    icon = condition === "Clear" || condition === "Clouds" ? "🌬️" : `${icon}🌬️`;
  }

  return icon;
};

let currentRequest = null;

const getWeather = (event) => {
  if (event) {
    event.preventDefault();
  }

  const cityValue = cityRef.value.trim();
  if (cityValue.length === 0) {
    result.innerHTML = `<h3 class="msg">Please enter a city name</h3>`;
    return;
  }

  if (typeof key === "undefined" || !key) {
    result.innerHTML = `<h3 class="msg">Missing API key</h3>`;
    return;
  }

  result.innerHTML = `<div class="loader" role="status" aria-label="Loading weather">
        <div class="loader-ring" aria-hidden="true"></div>
        <p class="loader-text">Loading</p>
      </div>`;
  searchBtn.disabled = true;

  if (currentRequest) {
    currentRequest.abort();
  }
  currentRequest = new AbortController();

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    cityValue
  )}&appid=${key}&units=metric`;

  fetch(url, { signal: currentRequest.signal })
    .then((resp) => resp.json())
    .then((data) => {
      if (Number(data.cod) !== 200) {
        result.innerHTML = `<h3 class="msg">city not found</h3>`;
        return;
      }

      const windSpeed = data.wind && data.wind.speed ? data.wind.speed : 0;
      const isWindy =
        windSpeed >= 8 || /wind/i.test(data.weather[0].description || "");
      const weatherLabel =
        isWindy && data.weather[0].main !== "Squall"
          ? `${data.weather[0].main} · Windy`
          : data.weather[0].main;

      result.innerHTML = `<h2>${escapeHtml(data.name)}</h2>
        <h4 class="weather">${escapeHtml(weatherLabel)}</h4>
        <h4 class="desc">${escapeHtml(data.weather[0].description)}</h4>
        <div class="weather-icon" aria-hidden="true">${getWeatherIcon(data)}</div>
        <h1>${Math.round(data.main.temp)} &#176;</h1>
        <div class="temp-container">
          <div>
            <h4 class="title">min</h4>
            <h4 class="temp">${Math.round(data.main.temp_min)}&#176;</h4>
          </div>
          <div>
            <h4 class="title">max</h4>
            <h4 class="temp">${Math.round(data.main.temp_max)}&#176;</h4>
          </div>
        </div>`;
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        return;
      }
      result.innerHTML = `<h3 class="msg">city not found</h3>`;
    })
    .finally(() => {
      searchBtn.disabled = false;
    });
};

searchForm.addEventListener("submit", getWeather);
getWeather();
