"use strict";
var documentClient = require("documentdb").DocumentClient;
var config = require("../routes/config");
var url = require('url');
var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });

var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;

function getDatabase() {
    // console.log(`Getting database:\n${config.database.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDatabase(databaseUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDatabase(config.database, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}

function getCollection() {
    // console.log(`Getting collection:\n${config.collection.id}\n`);

    return new Promise((resolve, reject) => {
        client.readCollection(collectionUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createCollection(databaseUrl, config.collection, { offerThroughput: 400 }, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}

function queryCollection(latitude,longitude,radius) {
    console.log(`Querying collection through index:${config.collection.id}`);
//     var query_template_front=`select f.id,f.duration,f.endLocation.coordinates
//             from journey f
//             where ST_DISTANCE(f.endLocation,{'type':'Point','coordinates':[`;
//     var query_template_end=`]})<1000000
// and f.endTimeEpoch>1522253254050
// and f.status="Stay"`
    var query=`select f.id,f.duration,f.endLocation.coordinates
            from journey f
            where ST_DISTANCE(f.endLocation,{'type':'Point','coordinates':[`+latitude+`,`+longitude+`]})<= `+`1000000`
+` and f.endTimeEpoch>1522253254050
and f.status="Stay"`
    // var query=query_template_front+latitude+`,`+longitude+query_template_end
    console.log(query);
    return new Promise((resolve, reject) => {
        client.queryDocuments(
            collectionUrl,
            query,
            {enableCrossPartitionQuery: true }
        ).toArray((err, results) => {
            if (err) reject(err)
            else {
                // for (var queryResult of results) {
                //     let resultString = JSON.stringify(queryResult);
                //     console.log(`\tQuery returned ${resultString}`);
                // }
                // console.log();
                resolve(results);
            }
        });
    })
};

function exit(message) {
    console.log(message);
    // console.log('Press any key to exit');
    // process.stdin.resume();
    // process.stdin.on('data', process.exit.bind(process, 0));
    //
}
// getDatabase()
//     .then(() => getCollection())
//     .then(() => queryCollection(-122.0312186,37.33233141))
//     .then(()  =>{exit(`Completed successfully`);})
//     .catch((error)=>{exit(`Completed with error ${JSON.stringify(error)}`)});


module.exports={
    queryCollection:queryCollection,
    getCollection:getCollection,
    getDatabase:getDatabase,
    exit:exit

}
