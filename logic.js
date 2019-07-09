// Create a map object
var myMap = L.map("map", {
  center: [0,0],
  zoom: 3,
});

// Add a tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.pencil",
  noWrap: true,
  accessToken: API_KEY
}).addTo(myMap);



var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Grabbing our GeoJSON data..
d3.json(link, function(data) {

// // Grabbing our GeoJSON data..
// d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {fillOpacity: 1, color: 'black', radius: getRadius(feature.properties.mag), fillColor: getColor(feature.properties.mag), weight: 1});
    }
    , onEachFeature: onEachFeature
  })
  .addTo(myMap);
});

function onEachFeature(feature, layer) {
  layer.bindPopup(feature.properties.place + '<br>' + "Magnitude" + ": " + feature.properties.mag)
}


function getColor(mag) {
          switch (true) {
            case  mag<1:
              return  'green';
            case mag<2:
              return 'yellowgreen';
            case mag<3:
              return 'lightsalmon';
            case mag<4:
              return 'orange';
            case mag<5:
              return 'darkorange';
            case mag>=5:
              return 'red';
          }
        }

function getRadius(mag) {
          switch (true) {
            case  mag<3:
              return  '2';
            case mag<5:
              return '6';
            case mag>=5:
              return '10';
          }
        }

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
      mag = [[0, '0-1'], [1, '1-2'], [2, '2-3'], [3, '3-4'], [4, '4-5'], [5, '5+']]

  for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(mag[i][0]) + '"></i> ' +
            mag[i][1] + '<br>';
    }

    return div;
};

legend.addTo(myMap);
