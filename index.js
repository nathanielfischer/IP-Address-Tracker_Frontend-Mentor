var map;
var myIcon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [37, 45],
  iconAnchor: [18, 45],
});


checkIpInput();



// ---------------------- "EVENT LISTENER" ----------------------

$(".btn").click(function () {
  checkIpInput();
});


$('.form-control').keypress(function (e) {
  if (e.which == 13) {
    checkIpInput();
  }
});



// ---------------------- MAP API ----------------------

/**
 * Initializes the map with few of a specified location and sets the marker
 * @param  {number} lat latitude of the IP location
 * @param  {number} lon longitude of the IP location
 */
function initializeMap(lat, lon) {
  map = L.map('map').setView([lat, lon], 11);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  let marker = L.marker([lat, lon], { icon: myIcon }).addTo(map);
}


/**
 * Updates the map to a new location and sets the marker
 * @param  {number} lat latitude of the IP location
 * @param  {number} lon longitude of the IP location
 */
function updateMap(lat, lon) {
  map.setView([lat, lon], 11);
  let marker = L.marker([lat, lon], { icon: myIcon }).addTo(map);
}





// ---------------------- IP Address ----------------------

/**
 * Gets data from Input field
 * If no Input: it will use clients IP address
 * If error on Geoloaction API: set map to munich
 */
function checkIpInput() {
  let ip = $(".form-control")[0].value;
  let url = "http://ip-api.com/json/";

  if (ip !== "") {
    url += ip;
  }

  getMyIp("GET", url)
    .then(function (e) {
      let data = JSON.parse(e.target.response);
      ip = data.query;

      //checks if the map is already initialized. 
      if (map === undefined) {
        initializeMap(data.lat, data.lon);
      } else {
        updateMap(data.lat, data.lon);
      }

      const location = data.city + ", " + data.country;
      setStats(data.query, location, data.timezone, data.isp);
    }, function (e) {
      // handle errors of IP Geolocation API
      console.error("Error: IP Geolocation API");

      //set Map to munich, if there is an error
      if (map === undefined) {
        initializeMap(48.1238198, 11.594644);
      } else {
        updateMap(48.1238198, 11.594644);
      }

      //set stats to error
      setStats("There", "is", "an", "error");
    });
}


// API IP Address
function getMyIp(method, url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}


/**
 * Updates the stats section in the DOM with the new data
 * @param  {String} ip
 * @param  {String} location
 * @param  {String} timezone
 * @param  {String} isp
 */
function setStats(ip, location, timezone, isp){
  $(".stats h2").eq(0).text(ip);
  $(".stats h2").eq(1).text(location);
  $(".stats h2").eq(2).text(timezone);
  $(".stats h2").eq(3).text(isp);
}



