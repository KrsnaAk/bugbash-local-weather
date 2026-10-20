const app = document.querySelector("#app");
const cities = {
  Delhi: { c: 31, sky: "Sunny" },
  Pune: { c: 26, sky: "Cloudy" },
  Kolkata: { c: 29, sky: "Humid" },
};
let city = "Delhi",
  unit = "C";
function render() {
  const data = cities[city] || cities.Delhi,
    temp = unit === "C" ? data.c : Math.round((data.c * 9) / 5 + 32);
  app.innerHTML = `<div class="row space"><div><span class="label">Local forecast</span><h2>${city}</h2></div><button id="refresh" class="secondary">Refresh</button></div><div class="grid"><input id="city" value="${city}" list="cities"/><datalist id="cities">${Object.keys(
    cities,
  )
    .map((c) => `<option>${c}</option>`)
    .join(
      "",
    )}</datalist><select id="unit"><option>C</option><option>F</option></select></div><article class="tile"><span class="label">${data.sky}</span><h3>${temp}°${unit}</h3><p class="muted">Static fixture data. No external weather service is used.</p></article>`;
  document.querySelector("#city").onchange = (e) => {
    city = e.target.value;
    render();
  };
  document.querySelector("#unit").onchange = (e) => {
    unit = e.target.value;
    render();
  };
  document.querySelector("#refresh").onclick = () => {
    city = "Delhi";
    render();
  };
}
render();


// Added organizer feature: recent-city memory for the current session.
const recentCities = [];
function rememberCity(value) { if (cities[value] && !recentCities.includes(value)) recentCities.unshift(value); return recentCities.slice(0, 3); }


// Weather expansion: recent searches and deterministic forecast status.
(() => {
  const baseRender = render; const recent = []; let status = "ready";
  const enhance = () => {
    if (document.querySelector("#weather-tools")) return;
    const panel = document.createElement("section"); panel.id = "weather-tools"; panel.className = "item";
    panel.innerHTML = '<strong>Forecast tools</strong><button id="remember-city" type="button">Remember city</button><p id="weather-summary" class="muted small"></p>';
    document.querySelector("#app")?.append(panel);
    panel.querySelector("#remember-city").onclick = () => { if (city.trim()) recent.unshift(city); panel.querySelector("#weather-summary").textContent = status + " · " + recent.slice(0, 3).join(", "); };
    panel.querySelector("#weather-summary").textContent = status + " · no recent searches";
  };
  render = () => { baseRender(); enhance(); };
  enhance();
})();
