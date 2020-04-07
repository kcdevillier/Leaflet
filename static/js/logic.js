
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

//function to create maps
function createMap(data, legend){
    
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
    
    var baseMaps = {
        "Satellite": satMap,
        "Light Map": lightMap,
        "Dark Map": darkMap
    };
    //clickable option for layers, earthquake and faultline   
    var overlayMaps = { 
        "Earthquakes:": data
    };

    var map = L.map('map', { 
        center: [37.733795,-122.446747],
        zoom: 8,
        layers: [baseMaps, overlayMaps]
    }); 

    L.control.layers(baseMaps, overlayMaps, { 
        collapsed:false
    }).addTo(map);

    legend.addTo(map);

    
};

var geojson;

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

        //set marker options
        // var geojsonMarkerOptions = {
        //     radius: 40,
        //     fillColor: "#ff7800",
        //     color: "#000",
        //     weight: 1,
        //     opacity: 1,
        //     fillOpacity: 0.8
        // };
        
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

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        
        // create legend html table
        var legendInfo = "<h1>Color Legend</h1>" +
        "<div class=\"labels\">" +
            "<table>" + "<tr>" +
            "<th>Magnitude</th><th>Color</th>" + "</tr>" +
            "<tr><td> > 1 </td><td> </tr>" +


        "</div>";

        div.innerHTML = legendInfo;
        div.innerHTML += "<ul>" +  "</ul>";
        return div;
    };

    console.log(typeof eqLayer)        
    
    createMap(eqLayer, legend);
};

d3.json(url, earthQMarkers);