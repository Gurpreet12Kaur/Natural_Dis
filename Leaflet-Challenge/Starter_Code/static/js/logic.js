// URL for GeoJSON earthquakes data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Define the markerSize function
function markerSize(magnitude) {
    return magnitude * 5; // Adjust this factor for marker size
}

// Create a function to handle the earthquake data
function createMap(earthquakeData) {
    // Define a function to create the popup content
    function onEachFeature(feature, layer) {
        var popupContent = `
            <h3>Location: ${feature.properties.place}</h3>
            <hr>
            <p>Date: ${new Date(feature.properties.time)}</p>
            <p>Magnitude: ${feature.properties.mag}</p>
            <p>Depth: ${feature.geometry.coordinates[2]}</p>
        `;
        layer.bindPopup(popupContent);
    }

    // Define a function to set marker style based on magnitude and depth
    function style(feature) {
        return {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: "black",
            weight: 0.5
        };
    }

    // Create a GeoJSON layer with the earthquake data and apply style and popups
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
        onEachFeature: onEachFeature
    });

    // Create a base map layer
    var baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    // Create an overlay map layer for earthquakes
    var overlayMap = {
        "Earthquakes": earthquakes
    };

    // Create the map with layers
    var map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        layers: [baseMap, earthquakes]
    });

    // Create a legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depthValues = [0, 10, 30, 50, 70, 90];
        var labels = ['<strong>Depth (km)</strong>'];

        for (var i = 0; i < depthValues.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(depthValues[i] + 1) + '"></i> ' +
                depthValues[i] + (depthValues[i + 1] ? '&ndash;' + depthValues[i + 1] + ' km<br>' : '+ km');
        }

        div.innerHTML = labels.join('<br>') + div.innerHTML;
        return div;
    };
    legend.addTo(map);
}

// Perform a GET request to fetch earthquake data and create the map
d3.json(url).then(createMap);

