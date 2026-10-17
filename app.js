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
