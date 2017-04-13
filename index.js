var express = require('express');
var layawayApp = express();
//Place psql require here		FIXME
//var morgan = require('morgan');
//var bodyParser = require('body-parser');
//var methodOverride = require('method-override');


var pg = require('pg');
var conString = 'postgres://Devon:dvoshpgsql5421@localhost/sslayaway';
var client = new pg.Client(conString);

layawayApp.use(express.static(__dirname + '/www'));

/*
function getUser() {
	var results = [];
	pg.connect(conString, function (error, client, done) {
		if (error) {
			return console.error('error fetching client from pool', error);
		}

		var query = client.query('SELECT * FROM customer;');

		query.on('row', (row) => {
      		results.push(row);
    	});

    	query.on('end', () => {
    	  	done();
      		return results;
    	});

    	/*
		client.query('SELECT * FROM customer;', function(error, result) {
			done();

			if (error) {
				return console.error("error during query");
			}

			return result;
			process.exit(0);
		});
		
	});
}
*/


//App API routes

/*
layawayApp.get('/api/getUser', function(request, response, next) {
	var userData = getUser();
	response.json(userData);
});
*/

layawayApp.get('/api/getUser', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(conString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM customer;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


layawayApp.get('*', function(request, response) {
	response.sendFile('./www/index.html');
});


//Listen on port
layawayApp.listen(8787);
console.log("App listening on port 8787");