
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

//function to create maps
function createMap(data, legend){
    
    //create base tile layers
    var satMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 8,
        id: "mapbox.satellite",
        accessToken: API_KEY});

    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY});
    
    var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY});
    
    //store base tile layers in dict
    var baseMaps = {
        "Satellite":satMap,
        "Light Map":lightMap,
        "Dark Map":darkMap
    };
    
    map = L.map('map', { 
        center: [37.733795,-122.446747],
        zoom: 8,
        layers: [satMap, lightMap, darkMap]
    }); 

    //create lines for tectonic plates
    d3.json("/static/data/PB2002_plates.json", function(response) {
               
        var plateData = L.geoJSON(response, { 
            pointToLayer: function (feature, latlng) {   
            },
            fill: false, 
            color: "orange",
            weight: "2"
        })
        overlayMaps = {
            "Earthquakes": data, 
            "Tectonic Plates": plateData
        }
        //add layers to control center
        L.control.layers(baseMaps, overlayMaps).addTo(map);

    })

    legend.addTo(map);
};

//function for coloring circles by magnitude
function getColor(d) {
    return d > 8 ? '#7f0000' :
        d > 7 ? '#b30000' :
        d > 6  ? '#d7301f' :
        d > 5  ? '#ef6548' :
        d > 4  ? '#fc8d59' :
        d > 3   ? '#fdbb84' :
        d > 2   ? '#fdd49e' :
        d > 1   ? '#fee8c8' :
                  '#fff7ec';
}

//function to create earthquake markers
function earthQMarkers(response){

    var eqLayer = L.geoJSON(response, {
        pointToLayer: function (feature, latlng) {

            //set marker options according to earthquake magnitude
            var cMarker = L.circleMarker(latlng, geojsonMarkerOptions = {  
                radius: feature.properties.mag *5, 
                fillColor: getColor(feature.properties.mag),
                color: feature.properties.mag,
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                riseOnHover: true
            });

            return cMarker;
        },    

        onEachFeature: function(feature, layer){
            var date = new Date(feature.properties.time);
            layer.bindPopup(`Place & Mag.: ${feature.properties.title} <br> Date: ${date}`)
        }
    });

    //set up map legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        
        // create legend html table
        var legendInfo = "<h1>Color Legend</h1>" +
        "<div class=\"labels\">" +
            "<table>" + "<tr>" +
            "<th>Magnitude</th><th>Color</th>" + "</tr>" +
            "<tr><td> 1-2 </td><td style='background-color:#fee8c8'> </td></tr>" +
            "<tr><td> 2-3 </td><td style='background-color:#fdd49e'> </td></tr>" +
            "<tr><td> 3-4 </td><td style='background-color:#fdbb84'> </td></tr>" +
            "<tr><td> 4-5 </td><td style='background-color:#fc8d59'> </td></tr>" +
            "<tr><td> 5-6 </td><td style='background-color:#ef6548'> </td></tr>" +
            "<tr><td> 6-7 </td><td style='background-color:#d7301f'> </td></tr>" +
            "<tr><td> 7-8 </td><td style='background-color:#b30000'> </td></tr>" +
            "<tr><td> > 8 </td><td style='background-color:#7f0000'> </td></tr></table>" +

        "</div>";

        div.innerHTML = legendInfo;
        // div.innerHTML += "<ul>" + "Mag: 1-2 " + "<html color='#fee8c8'> dddd </text>" + "</ul>";
        return div;
    };

   
    
    
    //send data to create maps function
    createMap(eqLayer, legend);
};

//function to create tectonic plate line layer
// function plateLines(){
    
//     return(d3.json("/static/data/PB2002_plates.json", function(response) {
               
//         var plateData = L.geoJSON(response, { 
            
//             pointToLayer: function (feature, latlng) {
//             var plate = L.marker(latlng, {
//                 color: 'red'
//             })
//         return plate;
//         }
//     })
//     return plateData; 
//     })); 

    
// };

d3.json(url, earthQMarkers);