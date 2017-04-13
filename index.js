console.log("Hello LawayAway API!");

var express = require('express');
var layawayApp = express();
//Place psql require here		FIXME
//var morgan = require('morgan');
//var bodyParser = require('body-parser');
//var methodOverride = require('method-override');


var pg = require('pg');
var conString = 'postgres://Devon:dvoshpgsql5421@localhost/sslayaway';


pg.connect(conString, function (error, client, done) {
	if (error) {
		return console.error('error fetching client from pool', error);
	}
	client.query('SELECT * FROM customer;', function(error, result) {
		done();

		if (error) {
			return console.error("error during query");
		}

		console.log(result.rows[0]);
		process.exit(0);
	});
});



//Listen on port
layawayApp.listen(8787);
console.log("App listening on port 8787");