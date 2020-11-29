const API_KEY = "pk.eyJ1Ijoia3RtYXAxIiwiYSI6ImNraHBqNTF3YzAxNGcycW56Zzd2aWozZDkifQ.CjRG0a4QlzXUOZBwp-SPzg";

// Creating map object
var myMap = L.map("mapid", {
    center: [34.0522, -90.2437],
    zoom: 3
});

// Adding tile layer
// var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "dark-v10",
//     accessToken: API_KEY
// }).addTo(myMap);

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    mapZoom: 15,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

// var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     maxZoom: 18,
//     id: "streets-v11",
//     accessToken: API_KEY
// });

var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
var baseMaps = {
    "Outdoor Map": outdoormap,
    "Dark Map": darkmap,
    "Light Map": lightmap
};
outdoormap.addTo(myMap)

var earthquakes = new L.LayerGroup()


// Create overlay object to hold our overlay layer
var overlayMaps = {
    "Earthquakes": earthquakes
};

// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Load in geojson data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


// Add a marker to the map for each crime
d3.json(link, function (response) {
    function circleadd(features) {
        return {
            radius: circlesize(features.properties.mag),
            fillColor: circlecolor(features.geometry.coordinates[2]),
            weight: .5,
            color: "black"
        }
    }
    console.log(response);
    function circlecolor(depth) {
        if (depth > 90)
            return "red";
        else if (depth > 70)
            return "orange"
        else if (depth > 50)
            return "coral"
        else if (depth > 30)
            return "pink"
        else if (depth > 10)
            return "purple"
        else
            return "green"
    }

    function circlesize(mag) {
        if (mag === 0) {
            return 1
        } else
            return mag * 5

    }


    L.geoJSON(response, {
        pointToLayer: function (features, latlong) {
            return L.circleMarker(latlong);
        },
        style: circleadd,
        onEachFeature: function (features, layer) {
            layer.bindPopup(`<h3> ${features.properties.place} </h3> <hr> <p> <h3> Mag: ${features.properties.mag} </h3> <hr>${(features.geometry.coordinates[2])} </p>`);
        }




    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = choroplethLayer.options.limits;
        var colors = choroplethLayer.options.colors;
        var labels = [];

        // Adding legend to the map
        legend.addTo(myMap);

        // Add min & max to the html
        div.innerHTML = "<h1>Median Income</h1>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        limits.forEach(function (limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
});
