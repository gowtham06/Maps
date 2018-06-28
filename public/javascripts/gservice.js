// Google maps Service module
angular.module('gservice',[])
    .factory('gservice',function ($http) {
    var googleMapService={};
    var locations=[];

    var selectedLat=-119.180395633;
    var selectedLong=34.244498898;
    var selectRadius=1000000;

    googleMapService.refresh=function(latitude,longitude,radius) {
        locations = [];
        selectedLat = latitude;
        selectedLong = longitude;
        selectRadius = radius;
        var queryData = {
            latitude: selectedLat,
            longitude: selectedLong,
            radius: 1000000
        };

        $http.post('/getParkedCars', queryData).then(function (response) {
            locations = convertToMapPoints(response);

            initialize(longitude, latitude);

        }),function () {};
    };

    var convertToMapPoints=function(response){
        var locations=[];
        for(var i=0;i<response.length;i++) {

            var user=response[i];
            console.log(user);
            var contentString=
                `<br><b>Id</b>: `+user.id+
                `<br><b>Duration</b>: `+user.duration+
                `<br><b>Latitude</b>: `+user.coordinates[1]+
                `<br><b>Longitude</b>: `+user.coordinates[0]+
                `</p>`;

            locations.push({
                latlon:new google.maps.Latlng(user.coordinates[1],user.coordinates[0]),
                message:new google.maps.InfoWindow({
                    content:contentString,
                    maxWidth:320
                }),
                id:user.id,
                duration:user.duration,
                latitude:user.coordinates[1],
                longitude:user.coordinates[0]
            });
        }

        return locations;


    };
                    // Initializes the map
    var initialize = function(latitude, longitude) {

        // Uses the selected lat, long as starting point
        var myLatLng = {lat: selectedLat, lng: selectedLong};

        // If map has not been created already...
        if (!map){

            // Create a new map and place in the index.html page
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 1,
                center: myLatLng
            });
        }

        // Loop through each location in the array and place a marker
        locations.forEach(function(n, i){
            var marker = new google.maps.Marker({
                position: n.latlon,
                map: map,
                title: "Big Map",
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            });

            // For each marker created, add a listener that checks for clicks
            google.maps.event.addListener(marker, 'click', function(e){

                // When clicked, open the selected marker's message
                currentSelectedMarker = n;
                n.message.open(map, marker);
            });
        });

            // Set initial location as a bouncing red marker
            var initialLocation = new google.maps.LatLng(-122.0312186,37.33233141);
            console.log(initialLocation)
            var marker = new google.maps.Marker({
                position: initialLocation,
                // animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
            lastMarker = marker;

        };
// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(selectedLat, selectedLong));

        return googleMapService;
    });
