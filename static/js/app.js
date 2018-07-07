// Add base layer
var base = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1IjoiZHRhbmcyOSIsImEiOiJjaml4d3VjdDAwNGc1M3ZwY2c5N2l6NzNxIn0." +
"bmCkx-wQYo-__4VKq3P5qA");

// Set variables for our endpoints to grab the data
var url = "/api/crimedata/sfgrid";
var assault_url = "/api/crimedata/2018/assault";
var vandalism_url = "/api/crimedata/2018/vandalism";
var theft_url = "/api/crimedata/2018/theft";

///////////////////////
//Create SF Grid
///////////////////////
d3.json(url, function(assault_data) {

var sflayer = L.geoJson(assault_data, {
// Style each feature (in this case a neighborhood)
style: function(feature) {
    return {
        color: "grey",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        // fillColor: chooseColor(feature.properties.borough),
        fillOpacity: 0.5,
        weight: 1.5
    };
}
})

////////////////////////////////////
//Create Marker Clusters for Assault
////////////////////////////////////
var assaultMarkers = [];
d3.json(assault_url, function(response) {

  // Creating a new marker cluster group
  var markers = L.markerClusterGroup();

  // Loop through our data...
  for (var i = 0; i < response.length; i++) {
  // set the data location property to a variable

  // Add a new marker to the cluster group and bind a pop-up
      // markers.addLayer(L.marker([response[i].Y, response[i].X])
      // .bindPopup(response[i].Descript));
      assaultMarkers.push(
          markers.addLayer(L.marker([response[i].Y, response[i].X]).bindPopup(response[i].Descript))
      );

  }

  ////////////////////////////////////
  //Create Marker Clusters for Vandalism
  ////////////////////////////////////
  var vandalismMarkers = [];
  d3.json(vandalism_url, function(response) {

    // Creating a new marker cluster group
    var vmarkers = L.markerClusterGroup();
    // Loop through our data...
    for (var i = 0; i < response.length; i++) {
    // set the data location property to a variable

    // Add a new marker to the cluster group and bind a pop-up
        // markers.addLayer(L.marker([response[i].Y, response[i].X])
        // .bindPopup(response[i].Descript));
        vandalismMarkers.push(
            vmarkers.addLayer(L.marker([response[i].Y, response[i].X]).bindPopup(response[i].Descript))
        );
    }


    ///////////////////////////////////
    //Create Marker Clusters for Theft/Larceny
    ////////////////////////////////////
    var theftMarkers = [];
    d3.json(theft_url, function(response) {

      // Creating a new marker cluster group
      var markers = L.markerClusterGroup();

      // Loop through our data...
      for (var i = 0; i < response.length; i++) {
      // set the data location property to a variable

      // Add a new marker to the cluster group and bind a pop-up
          // markers.addLayer(L.marker([response[i].Y, response[i].X])
          // .bindPopup(response[i].Descript));
          theftMarkers.push(
              markers.addLayer(L.marker([response[i].Y, response[i].X]).bindPopup(response[i].Descript))
          );

      }

      // console.log(theftMarkers);
      var assaultLayer = L.layerGroup(assaultMarkers);
      var vandalismLayer = L.layerGroup(vandalismMarkers);
      var theftLayer = L.layerGroup(theftMarkers);

      //Create the layers 
      var baseMaps = {
          Base: base
      };

      var overlayMaps = {
          "SF Neighborhoods": sflayer,
          Assault: assaultLayer,
          Vandalism: vandalismLayer,
          Theft:theftLayer

      };

      //Create the map
      var map = L.map("map", {
      center: [37.77397, -122.43129],
      zoom: 11,
      layers: [base, sflayer, assaultLayer, vandalismLayer,theftLayer]
      });

      //Add the layers to the map
      L.control.layers(baseMaps, overlayMaps).addTo(map);
      
      });
    });
  });
});