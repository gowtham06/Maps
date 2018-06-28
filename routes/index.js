var express = require('express');
var router = express.Router();
var dbConnection=require('../routes/azureDataConnection')


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.get('/',function (req,res) {
    res.render('home.html');
});

router.post('/getParkedCars',function (req,res) {
    console.log(req.body)

    var longitude=parseFloat(req.body.longitude);
    var latitude=parseFloat(req.body.latitude);
    console.log(latitude,longitude);
// res.json({message:'Got the request with latitude:'+latitude+' and longitude:'+longitude})
// console.log(latitude);
    dbConnection.queryCollection(latitude,longitude).then(function (result,error) {
            if (result) {
                console.log(JSON.stringify(result));
                res.send(result)
                exit(`Completed successfully`);
            }
            else{
                console.log(error)
                res.send(error);
                // throw  error;

            }
        }
    ).catch((error)=>{exit(`Completed with error ${JSON.stringify(error)}`)});


});
module.exports = router;
