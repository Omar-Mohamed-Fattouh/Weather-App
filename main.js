const result = document.getElementById("result");
const searchBtn = document.getElementById("search-btn");
const cityRef = document.getElementById("city");

const getWeather = () => {
  const cityValue = cityRef.value.trim();

  if (cityValue.length === 0) {
    result.innerHTML = `<h3 class="msg">Please enter a city name</h3>`;
    return;
  }

  if (typeof key === "undefined" || !key) {
    result.innerHTML = `<h3 class="msg">Missing API key</h3>`;
    return;
  }

  result.innerHTML = `<h3 class="msg">Loading...</h3>`;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    cityValue
  )}&appid=${key}&units=metric`;

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      if (Number(data.cod) !== 200) {
        result.innerHTML = `<h3 class="msg">${
          data.message || "city not found"
        }</h3>`;
        return;
      }

      result.innerHTML = `<h2>${data.name}</h2>
        <h4 class="weather">${data.weather[0].main}</h4>
        <h4 class="desc">${data.weather[0].description}</h4>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
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
    .catch(() => {
      result.innerHTML = `<h3 class="msg">Unable to fetch weather</h3>`;
    });
};

searchBtn.addEventListener("click", getWeather);
cityRef.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
});
window.addEventListener("load", getWeather);
