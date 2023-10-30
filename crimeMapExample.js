// Include Leaflet and Leaflet.markercluster libraries from your CDN
var leafletScript = document.createElement('script');
leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
document.head.appendChild(leafletScript);

var markerClusterScript = document.createElement('script');
markerClusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
document.head.appendChild(markerClusterScript);

var leafletCSS = document.createElement('link');
leafletCSS.rel = 'stylesheet';
leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
document.head.appendChild(leafletCSS);

var markerClusterCSS = document.createElement('link');
markerClusterCSS.rel = 'stylesheet';
markerClusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
document.head.appendChild(markerClusterCSS);

var markerClusterDefaultCSS = document.createElement('link');
markerClusterDefaultCSS.rel = 'stylesheet';
markerClusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
document.head.appendChild(markerClusterDefaultCSS);

// Create a custom icon
var customIcon;
var map;

// After the scripts are loaded, you can use Leaflet and Leaflet.markercluster
leafletScript.onload = function () {
    // Initialize your Leaflet map and use other Leaflet functionality
    map = L.map('map').setView([34.042327, -118.259418], 10);

    // Add a tile layer (e.g., OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    // Define custom icon after Leaflet is loaded
    customIcon = L.icon({
        iconUrl: 'https://cdn.jsdelivr.net/gh/chance-robinson/fileHost@main/icons8-map-pin-48.webp        ',
        iconSize: [48, 48],
        iconAnchor: [24, 42],
    });
};

markerClusterScript.onload = function () {
// Create a marker cluster group
var clusterGroup = L.markerClusterGroup();
// Fetch your data from a URL
fetch("https://lapd-api.onrender.com/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    desc: [
      {
        label: ["BATTERY - SIMPLE ASSAULT"],
        value: ["BATTERY - SIMPLE ASSAULT"],
      },
    ],
    area: [],
    number: 90,
    startDate: "na",
    endDate: "na",
  }),
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error fetching data: " + response.statusText);
    }
  })
  .then((data) => {
    if (data.crimes.length === 0) {
      console.log("length 0");
    } else {
      const formattedCrimes = data.crimes.map((crime) => {
        const [desc, location, dateTime, address, lat, long, id] = crime;
        return {
          lat: lat,
          lng: long,
          title: `${desc}<br>${location}, ${address}<br>${new Date(
            dateTime
          ).toLocaleString()}`,
        };
      });
      formattedCrimes.forEach((marker) => {
        const markerLayer = L.marker([marker.lat, marker.lng], {
          icon: customIcon,
        }).bindPopup(marker.title);
        clusterGroup.addLayer(markerLayer);
      });

      map.addLayer(clusterGroup);
      console.log(formattedCrimes);
    }
  })
  .catch((error) => {
    console.error(error);
  });
};

var mapElement = document.getElementById('map');
mapElement.style.minHeight = '10px';