// Google maps Service module
angular.module('gservice', [])
    .factory('gservice', function($http) {

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        googleMapService.refresh=function(latitude,longitude){
            locations=[];
            selectedLat=latitude;
            selectedLong=longitude;

            $http.post('/getParkedCars').then(function (response) {
                locations=convertToMapPoints(response);
                initialize(latitude,longitude);

            }),function () {

            };
            };

        var convertToMapPoints=function(response){
            var locations=[];
            for(var i=0;i<response.length;i++){
                var user=response[i];
                var contentString='<p><b>Username</b>: ' + user.id+
                    '<br><b>Duration</b>: ' + user.duration +
                    '</p>';
                console.log(contentString);
                locations.push({
                    latlon:new google.maps.LatLng(user.coordinates[1],user.coordinates[0]),
                    message:new google.maps.InforWindow({
                        content:contentString,
                        maxWidth:320
                    }),
                    id:user.id,
                    duration:user.duration
                });
            }
            return locations;
        };
    var initialize=function (latitude,longitude) {
        var myLatLng={lat:selectedLat,lng:selectedLong};

        if(!map){
            var map=new google.maps.Map(document.getElementById('map'),{
                zoom:3,
                center:myLatLng
            });
        }
        locations.forEach(function (n,i) {

            var marker=new google.maps.Marker({
                position:n.latlon,
                map:map,
                title:"Big Map",
                icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            });

            google.maps.event.addListener(marker,'click',function (e) {
                currentSelectedMarker=n;
                n.message.open(map,marker);
            });
        });
        var initialLocation=new google.maps.LatLng(latitude,longitude);
        var marker=new google.maps.Marker({
            position:initialLocation,
            // animation:google.maps.Animation.Bounce,
            map:map,
            icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        lastMarker=marker;

    };

    google.maps.event.addDomListner(window,'load',googleMapService.refresh(selectedLat,selectedLong));

    return googleMapService;

    });