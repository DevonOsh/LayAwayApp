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

//Select a specific layaway item based on the customer number
layawayApp.put('/api/getLayaway/:cust_num', (req, res, next) => {
	const results = [];
	const cust_num = req.params.cust_num;

	pg.connect(conString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		const query = client.query('SELECT * from layaway WHERE cust_num = $1;', [cust_num]);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			return res.json(results);
		});
	});
});

//Select the layaway items
layawayApp.put('/api/getItems/', (req, res, next) => {
	const results = [];
	const layaway_num = "";
});


layawayApp.get('*', function(request, response) {
	response.sendFile('./www/index.html');
});

//FIXME TEST
//Create a new layaway item
layawayApp.post('/api/addItem', (req, res, next) => {
	const results = [];
	//Data from http request
	const data = req.body;

	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		//FIXME check on fields for insert statement
		client.query('INSERT INTO layaway_item(layaway_num, item_num, quantity, item_cost, description, img_url) values($1, $2, $3, $4, $5, $6',
			[data.layawayNum, data.itemNum, data.quantity, data.itemCost, data.description, data.imgUrl]);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			return res.json(results);
		});
	});
});


//Listen on port
layawayApp.listen(8787);
console.log("App listening on port 8787");