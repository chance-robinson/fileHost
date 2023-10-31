function loadMarkerClusters() {
    // Create a marker cluster group
    var clusterGroup = L.markerClusterGroup();
  
    // Fetch your data from a URL
    fetch("http://127.0.0.1:8000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        desc: [
          {
            value: ["BATTERY - SIMPLE ASSAULT"],
            label: ["BATTERY - SIMPLE ASSAULT"],
          },
        ],
        area: [],
        number: "90",
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
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  // Create a custom icon
  var customIcon;
  var map;
  
  // After the scripts are loaded, you can use Leaflet and Leaflet.markercluster
  // Initialize your Leaflet map and use other Leaflet functionality
  map = L.map("mapExample").setView([34.042327, -118.259418], 10);
  
  // Add a tile layer (e.g., OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ["a", "b", "c"],
  }).addTo(map);
  
  // Define custom icon after Leaflet is loaded
  customIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/chance-robinson/fileHost/main/icons8-map-pin-48.webp",
    iconSize: [48, 48],
    iconAnchor: [24, 42],
  });
  loadMarkerClusters();
  
  var mapElement = document.getElementById("mapExample");
  mapElement.style.minHeight = "10px";
  