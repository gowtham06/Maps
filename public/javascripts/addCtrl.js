var addCtrl=angular.module('addCtrl',['geolocation','gservice']);
addCtrl.controller('addCtrl',function($scope,$http,geolocation,gservice){
    $scope.formData={};
    var coords={};
    var lat=0;
    var long=0;
    var radius=0;

    // $scope.formData.latitude=-119.180395633;
    // $scope.formData.longitude=34.244498898;
    // $scope.formData.radius=1000000;

    $scope.findParked=function(){
        var queryData={
            latitude:parseFloat($scope.formData.latitude),
            longitude:parseFloat($scope.formData.longitude),
            radius:parseFloat($scope.formData.radius)
        };

        gservice.refresh(queryData.latitude,queryData.longitude,queryData.radius);
        // console.log(queryData.stringify());
        // console.log(queryData)
        // $http.post('/getParkedCars',queryData).then(function(data){
        //     console.log(data);
        //     $scope.formData.latitude=queryData.latitude;
        //     $scope.formData.longitude=queryData.longitude;
        //     $scope.formData.radius=queryData.radius;
        //     gservice.refresh($scope.formData.latitude,$scope.formData.longitude);
        // }),function (data) {
        //         console.log('Error:' +data);
        //     };



    };

});