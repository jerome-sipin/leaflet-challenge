// Get URL for API of 2.5 magnitude+ earthquakes over the past week
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Use D3 to read json
d3.json(url).then(function (data) {
  
    // Execute createFeatures function using data from the json
    createFeatures(data.features);

});

function createFeatures(earthquakeData) {

  // Function runs for every feature in the array. The popup describes where, when, the magnitude, and the depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3> Place: " + feature.properties.place + "</h3><h3>Magnitude:" + feature.properties.mag + "</h3><h3>Depth:" + feature.geometry.coordinates[2] + "</h3><h3>Time:" + new Date(feature.properties.time) + "</h3>")

  }



  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes=  L.geoJson(earthquakeData, {
    pointToLayer: function(feature, layer) {
        
        // Different radius depending on magnitude
        if (feature.properties.mag > 6.0){
            eRadius = 5 * 10;
        }
        else if (feature.properties.mag > 5.0){
            eRadius = 4 * 10
        }
        else if (feature.properties.mag > 4.0){
            eRadius = 3 * 10
        }
        else if (feature.properties.mag > 3.0){
            eRadius = 2 * 10 
        }
        else{
            eRadius = 10
        }

        // Different color depending on depth
        if (feature.geometry.coordinates[2] > 90){
            eColor = "#FF5F65"
        }
        else if (feature.geometry.coordinates[2] <= 90 && feature.geometry.coordinates[2] > 70){
            eColor = "#FCA35D"
        }
        else if (feature.geometry.coordinates[2] <= 70 && feature.geometry.coordinates[2] > 50){
            eColor = "#FDB72A"
        }
        else if (feature.geometry.coordinates[2] <= 50 && feature.geometry.coordinates[2] > 30){
            eColor = "#F7DB11"
        }
        else if (feature.geometry.coordinates[2] <= 90 && feature.geometry.coordinates[2] > 70){
            eColor = "#DCF400"
        }
        else{
            eColor = "#A3F600"
        }
        
        return new L.CircleMarker(layer, {
            fillOpacity: 0.5,
            color: eColor,
            fillColor: eColor,
            radius: eRadius
        });
    },
    onEachFeature: onEachFeature
  })

  // Send earthquake markers to map
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Earthquake Depth (km)</h4>";
    div.innerHTML += '<i style="background: #A3F600"></i><span>-10 - 10</span><br>';
    div.innerHTML += '<i style="background: #DCF400"></i><span>10 - 30</span><br>';
    div.innerHTML += '<i style="background: #F7DB11"></i><span>30 - 50</span><br>';
    div.innerHTML += '<i style="background: #FDB72A"></i><span>50 - 70</span><br>';
    div.innerHTML += '<i style="background: #FCA35D"></i><span>70 - 90</span><br>';
    div.innerHTML += '<i style="background: #FF5F65"></i><span>90+</span><br>';
    
  
    return div;
  };
  
  legend.addTo(myMap);
  
}




// // Get URL for significant earthquakes over the past month.
// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

// // Perform GET request to query URL
// d3.json(url).then(function(data){
//     createMarkers(data.features);
// })

// // Function to create maps
// function createMap(eMarkers){
  
//     // Create the tile layer that will be the background of our map.
//     var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     });

//     var baseMaps = {
//         "Base Map": streetmap
//     }
    
//     var overlayMaps = {
//         "Earthquakes": eMarkers
//     }

//     // Create the map object with options.
//     var map = L.map("map", {
//     center: [40.73, -74.0059],
//     zoom: 12,
//     layers: [streetmap, eMarkers]
//      });

//     // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//     }).addTo(map);
// }

// // Adds the markers to map object and creates the map
// function createMarkers(response){
    
//     var earthquakes = response.features;

//     // Create array to hold markers
//     var eMarkers = [];

//     for (var i = 0; i < earthquakes.length; i++){
//         var earthquake = earthquakes[i]
//         var cDate = new Date(earthquake.properties.time).toLocaleDateString("en-US")
//         var eMarker = L.marker([earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]])
//             .bindPopup("<h3> Place: " + earthquake.properties.place + "</h3><h3>Magnitude:" + earthquake.properties.magType + "</h3><h3>Depth:" + earthquake.geometry.coordinates[2] + "</h3><h3>Time:" + cDate + "</h3>")
//         eMarkers.push(eMarker);
//     }
//     createMap(L.layerGroup(eMarkers));
// }