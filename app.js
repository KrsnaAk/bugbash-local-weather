const app = document.querySelector("#app");
const API_KEY_STORAGE = "openweathermap-api-key";
let city = "Delhi";
let unit = "C";
let apiKey = localStorage.getItem(API_KEY_STORAGE) || "";
let weather = null;
let statusMessage = apiKey
  ? "Search for a city to load its current weather."
  : "Add your OpenWeatherMap API key to get started.";
let statusKind = "info";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function formatTemperature(celsius) {
  const temperature = unit === "C" ? celsius : (celsius * 9) / 5 + 32;
  return `${Math.round(temperature)}°${unit}`;
}

function render() {
  const conditions = weather
    ? `<section class="weather-panel" aria-label="Current conditions">
        <div><span class="label">${escapeHtml(weather.description)}</span><h3>${formatTemperature(weather.temperature)}</h3><p class="muted">Feels like ${formatTemperature(weather.feelsLike)}</p></div>
        <dl class="weather-details">
          <div><dt>Humidity</dt><dd>${weather.humidity}%</dd></div>
          <div><dt>Wind</dt><dd>${weather.windSpeed} m/s</dd></div>
          <div><dt>Coordinates</dt><dd>${weather.latitude.toFixed(3)}, ${weather.longitude.toFixed(3)}</dd></div>
        </dl>
      </section>`
    : `<div class="empty-state">Current conditions and the city map will appear here after a search.</div>`;
  const map = weather
    ? `<section class="map-section" aria-label="City map">
        <div class="row space"><h3>Map · ${escapeHtml(weather.name)}</h3><a class="map-link" href="${weather.mapUrl}" target="_blank" rel="noopener noreferrer">Open direct map ↗</a></div>
        <iframe title="Map centered on ${escapeHtml(weather.name)}" src="${weather.embedUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </section>`
    : "";

  app.innerHTML = `<form id="search-form" class="search-form">
    <label class="field"><span class="label">City</span><input id="city" name="city" value="${escapeHtml(city)}" placeholder="e.g. Delhi, IN" autocomplete="off" required /></label>
    <label class="field"><span class="label">OpenWeatherMap API key</span><input id="api-key" name="apiKey" type="password" value="${escapeHtml(apiKey)}" placeholder="Enter your API key" autocomplete="off" /></label>
    <div class="form-actions"><label class="unit-control"><span class="label">Units</span><select id="unit" aria-label="Temperature units"><option value="C" ${unit === "C" ? "selected" : ""}>°C</option><option value="F" ${unit === "F" ? "selected" : ""}>°F</option></select></label><button id="search" type="submit" ${statusKind === "loading" ? "disabled" : ""}>${statusKind === "loading" ? "Searching…" : weather ? "Update weather" : "Find city"}</button><button id="forget-key" class="secondary" type="button" ${apiKey ? "" : "disabled"}>Forget key</button></div>
  </form>
  <p class="status ${statusKind}" role="status">${escapeHtml(statusMessage)}</p>
  ${weather ? `<div class="row space location-heading"><div><span class="label">Current weather</span><h2>${escapeHtml(weather.name)}${weather.country ? `, ${escapeHtml(weather.country)}` : ""}</h2></div></div>` : ""}
  ${conditions}${map}`;

  document.querySelector("#search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const enteredKey = String(formData.get("apiKey") || "").trim();
    apiKey = enteredKey || apiKey;
    city = String(formData.get("city") || "").trim();
    unit = document.querySelector("#unit").value;
    if (enteredKey) {
      localStorage.setItem(API_KEY_STORAGE, apiKey);
    }
    loadWeather();
  });

  document.querySelector("#unit").addEventListener("change", (event) => {
    unit = event.target.value;
    render();
  });

  document.querySelector("#forget-key").addEventListener("click", () => {
    localStorage.removeItem(API_KEY_STORAGE);
    apiKey = "";
    statusMessage = "Saved API key removed. Enter a valid key to search.";
    statusKind = "info";
    render();
    document.querySelector("#api-key").focus();
  });
}

async function loadWeather() {
  if (!apiKey) {
    statusMessage = "Enter your OpenWeatherMap API key before searching.";
    statusKind = "error";
    render();
    document.querySelector("#api-key").focus();
    return;
  }
  if (!city) {
    statusMessage = "Enter a city name to search.";
    statusKind = "error";
    render();
    document.querySelector("#city").focus();
    return;
  }

  statusKind = "loading";
  statusMessage = `Looking up ${city}…`;
  render();

  try {
    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    url.search = new URLSearchParams({ q: city, appid: apiKey, units: "metric" });
    const response = await fetch(url);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? "OpenWeatherMap rejected this API key. Check that it was copied correctly and activated for your account. Newly created keys can take a while to become active; try again later or replace the key."
          : response.status === 404
            ? `No city found for “${city}”. Try a city and country code, such as “Paris, FR”.`
            : result.message || "Weather lookup failed. Please try again.",
      );
    }

    const { lat, lon } = result.coord;
    const padding = 0.04;
    const bounds = [lon - padding, lat - padding, lon + padding, lat + padding]
      .map((coordinate) => coordinate.toFixed(5))
      .join(",");
    const mapUrl = new URL("https://www.openstreetmap.org/");
    mapUrl.search = new URLSearchParams({ mlat: lat, mlon: lon });
    mapUrl.hash = `map=12/${lat}/${lon}`;
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&layer=mapnik&marker=${lat},${lon}`;

    weather = {
      name: result.name,
      country: result.sys.country,
      condition: result.weather[0].main.toLowerCase(),
      description: result.weather[0].description,
      temperature: result.main.temp,
      feelsLike: result.main.feels_like,
      humidity: result.main.humidity,
      windSpeed: result.wind.speed,
      latitude: lat,
      longitude: lon,
      mapUrl: mapUrl.toString(),
      embedUrl,
    };
    document.body.dataset.weather = weather.condition;
    city = result.name;
    statusMessage = "Weather updated from OpenWeatherMap.";
    statusKind = "success";
  } catch (error) {
    statusMessage = error instanceof TypeError
      ? "Could not reach the weather service. Check your connection and try again."
      : error.message;
    statusKind = "error";
  }

  render();
}

render();
