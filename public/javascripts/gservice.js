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
        var selectedLat = -87.6379883;
        var selectedLong = 41.8810089;

        // var selectedLat



        googleMapService.refresh=function(latitude,longitude,radius=1000000){

            locations=[];
            selectedLat=latitude;
            selectedLong=longitude;

            var queryData={
                latitude:latitude,
                longitude:longitude,
                radius:radius
            }
            // console.log(queryData)
            $http.post('/getParkedCars',queryData).then(function (response) {
                // console.log(response);
                locations=convertToMapPoints(response.data);
                // console.log(locations.length);
                initialize(latitude,longitude);

            }),function () {

            };
            };
        // console.log(selectedLat,selectedLong);

        var convertToMapPoints=function(response){
            console.log(response)
            // console.log(response.data);
            // console.log(response.length);
            var locations=[];
            for(var i=0;i<response.length;i++){
                var user=response[i];
                console.log(user)
                var contentString=
                    '<p><b>EndTime</b>: ' + user.endTime +
                    '<br><b>Latitude</b>: ' + user.coordinates[1] +
                    '<br><b>Longitude</b>: ' + user.coordinates[0] +
                    '</p>';
                // console.log(contentString);
                locations.push({
                    latlon:new google.maps.LatLng(user.coordinates[1],user.coordinates[0]),
                    message:new google.maps.InfoWindow({
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
        // var myLatLng={lat:selectedLat,lng:selectedLong};
        var myLatLng={lat:selectedLong,lng:selectedLat};

        if(!map){
            var map=new google.maps.Map(document.getElementById('map'),{
                zoom:18,
                center:myLatLng
            });
        }
        locations.forEach(function (n,i) {
            // console.log(n,i);

            var marker=new google.maps.Marker({
                position:n.latlon,
                map:map,
                title:"Big Map",
                icon:"http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            });

            // console.log(marker)
            // console.log(n.latlon);
            google.maps.event.addListener(marker,'click',function (e) {
                currentSelectedMarker=n;
                n.message.open(map,marker);
            });
        });
        // var initialLocation=new google.maps.LatLng(longitude,latitude);
        // var marker=new google.maps.Marker({
        //     position:initialLocation,
        //     animation:google.maps.Animation.Bounce,
        //     map:map,
        //     icon:'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        // });
        // lastMarker=marker;
        var selectedLocation=[];
        var contentString=
            '<p><b>Latitude</b>: ' + latitude +
            '<br><b>Longitude</b>: ' + longitude +
            '</p>';
        // console.log(contentString);
        selectedLocation.push({
            latlon:new google.maps.LatLng(longitude,latitude),
            message:new google.maps.InfoWindow({
                content:contentString,
                maxWidth:320

            }),
            id:"",
            duration:""
        });
        selectedLocation.forEach(function (n,i) {
            // console.log(n,i);

            var marker=new google.maps.Marker({
                position:n.latlon,
                map:map,
                title:"You are here",
                icon:"http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            });

            // console.log(marker)
            // console.log(n.latlon);
            google.maps.event.addListener(marker,'click',function (e) {
                currentSelectedMarker=n;
                n.message.open(map,marker);
            });
        });


    };

    google.maps.event.addDomListener(window,'load',googleMapService.refresh(selectedLat,selectedLong));

    return googleMapService;

    });