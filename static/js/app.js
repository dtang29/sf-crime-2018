var mapbox_url = "/api/mapbox/dark"
        // Add base layer
        var base = L.tileLayer("https://api.mapbox.com/styles/v1/dtang29/cjj4nypu128ag2slgg99psk1p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZHRhbmcyOSIsImEiOiJjaml4d3VjdDAwNGc1M3ZwY2c5N2l6NzNxIn0.bmCkx-wQYo-__4VKq3P5qA");
    
        // Set variables for our endpoints to grab the data
        var url = "/api/crimedata/sfgrid";
        var assault_url = "/api/crimedata/2018/assault";
        var vandalism_url = "/api/crimedata/2018/vandalism";
        var theft_url = "/api/crimedata/2018/theft";
    
       
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
                markers.addLayer(L.marker([response[i].Y, response[i].X]).bindPopup( '<b>' + response[i].Descript + '</b>' + '<br>' + response[i].Date +
                '<br>' + response[i].Address + '<br>' + 'Action taken by SFPD: ' + response[i].Resolution))
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
                    vmarkers.addLayer(L.marker([response[i].Y, response[i].X]).bindPopup( '<b>' + response[i].Descript + '</b>' + '<br>' + response[i].Date +
                   '<br>' + response[i].Address + '<br>' + 'Action taken by SFPD: ' + response[i].Resolution))
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
                        markers.addLayer(L.marker([response[i].Y, response[i].X]).bindPopup( '<b>' + response[i].Descript + '</b>' + '<br>' + response[i].Date +
                   '<br>' + response[i].Address + '<br>' + 'Action taken by SFPD: ' + response[i].Resolution))
                    );
    
                }
    
                // console.log(theftMarkers);
                var assaultLayer = L.layerGroup(assaultMarkers);
                var vandalismLayer = L.layerGroup(vandalismMarkers);
                var theftLayer = L.layerGroup(theftMarkers);
                
                //Create the layers 
                var baseMaps = {
                    "San Francisco": base
                };
                
                var overlayMaps = {
                    //"SF Neighborhoods": sflayer,
                    Assault: assaultLayer,
                    Vandalism: vandalismLayer,
                    Theft:theftLayer
    
                };
                
                //Create the map
                var map = L.map("map", {
                center: [37.77397, -122.43129],
                zoom: 11,
                layers: [base, assaultLayer, vandalismLayer,theftLayer]
                });
                
                ///////////////////////
                //Create SF Grid
                ///////////////////////
                d3.json(url, function(assault_data) {
                    L.geoJson(assault_data, {
                        // Style each feature (in this case a neighborhood)
                        style: function(feature) {
                            return {
                                color: "#0079FF",
                                // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
                                // fillColor: chooseColor(feature.properties.borough),
                                fillOpacity: 0.5,
                                weight: 1.5
                            };
                        },
                            // Called on each feature
                        onEachFeature: function(feature, layer) {
                        // Set mouse events to change map styling
                            layer.on({
                                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                                mouseover: function(event) {
                                layer = event.target;
                                console.log(layer);
                                layer.setStyle({
                                    fillOpacity: 0.9
                                });
                                },
                                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                                mouseout: function(event) {
                                layer = event.target;
                                console.log(layer);
                                layer.setStyle({
                                    fillOpacity: 0.5
                                });
                                },
                                // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
                                click: function(event) {
                                console.log(event.target);
                                map.fitBounds(event.target.getBounds());
                                }
                            });
                            // Giving each feature a pop-up with information pertinent to it
                            layer.bindPopup("<h1>" + feature.properties.name + "</h1>");
                        }
                    }).addTo(map);
    
    
                    //Add the layers to the map
                    L.control.layers(baseMaps, overlayMaps).addTo(map);
                });
            });
        });
    });