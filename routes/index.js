var express = require('express');
var router = express.Router();
var fs = require("fs");
var data = require('../routes/data.json')

// var dbConnection=require('../routes/azureDataConnection')


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/',function (req,res) {

    res.render('home.html');

});

router.post('/getParkedCars',function (req,res) {
    console.log("Inside the post request");
    // console.log(req.body)

    var longitude=parseFloat(req.body.longitude);
    var latitude=parseFloat(req.body.latitude);
    var radius=parseFloat(req.body.radius);
    // console.log(radius)
    // console.log(data)
    res.send(JSON.stringify(data))
    // res.sendFile(path.resolve('routes','data.json'))

    // res.send(obj)
    // res.send('../views/data.json')
    // console.log(latitude,longitude,radius);
// res.json({message:'Got the request with latitude:'+latitude+' and longitude:'+longitude})
// console.log(latitude);
//     dbConnection.queryCollection(latitude,longitude,radius).then(function (result,error) {
//             if (result) {
//                 // console.log(JSON.stringify(result));
//                 res.send(result)
//                 exit(`Completed successfully`);
//             }
//             else{
//                 console.log(error)
//                 // res.send(error);
//                 // throw  error;
//
//             }
//         }
//     ).catch((error)=>{exit(`Completed with error ${JSON.stringify(error)}`)});


});
module.exports = router;
