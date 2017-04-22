var express = require('express');
var layawayApp = express();
//Place psql require here		FIXME
//var morgan = require('morgan');
var bodyParser = require('body-parser');
//var methodOverride = require('method-override');


var pg = require('pg');
var conString = 'postgres://Devon:dvoshpgsql5421@localhost/sslayaway';
var client = new pg.Client(conString);

//FIXME check to see if bodyParser removes database update issues
layawayApp.use(bodyParser.json());
layawayApp.use(bodyParser.urlencoded({ extended: true }));
layawayApp.use(express.static(__dirname + '/www'));

//App API routes

layawayApp.get('/', function(request, response) {
	response.sendFile(__dirname + '/www/index.html');
});

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
      //return res.json(results);
      return res.status(200).json(results);
    });
  });
});

//Create a new customer
layawayApp.post('/api/addCust', (req, res, next) => {
	const results = {};
	const customers = [];
	//Grab customer data from body of request
	const custData = req.body.data;
	var layaway_num;
	console.log(custData);

	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		//Insert custData into the customer table
		client.query('INSERT INTO customer(cust_num, f_name, l_name, e_mail, username, password) values ($1, $2, $3, $4, $5, $6);', 
			[custData.cust_num, custData.f_name, custData.l_name, custData.e_mail, custData.username, custData.password]).
			then( () => {
				//Create an empty layaway for the customer
				createLayaway(custData.cust_num);
			});
		//Select all customers from the table and send them back to the client

		//FIXME remove
		//Create an empty layaway for the customer
		//layaway_num = createLayaway(custData.cust_num);
		//console.log("Layaway_num from addCust" + layaway_num);

		const query = client.query('SELECT * FROM customer');

		query.on('row', (row) => {
			customers.push(row);
		});
		//Results array of customers
		query.on('end', () => {
			done();
			results.customers = customers;
			results.layaway_num = layaway_num;

			//FIXME REMOVE
			console.log("Results object at end of addCust: ");
			console.log(results);
			//
			return res.json(results);
		});
	});
});

//Select a specific layaway item based on the customer number
//FIXME why are we not getting a successful response here?
layawayApp.put('/api/getLayawayNum/:cust_num', (req, res, next) => {
	const results = [];
	const cust_num = req.params.cust_num;

	console.log("Running getLayawayNum...");
	console.log("Cust num sent from client: " + cust_num);

	pg.connect(conString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		const query = client.query('SELECT layaway_num from layaway WHERE cust_num = $1 AND complete = false;', [cust_num]);

		query.on('error', function(error) {
			console.log("There was an error getting layaway_num...");
			console.log(error);
		});

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
layawayApp.put('/api/getItems/:layaway_num', (req, res, next) => {
	const results = [];
	const layaway_num = req.params.layaway_num;

	pg.connect(conString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		const query = client.query('SELECT * FROM layaway_item WHERE layaway_num = $1;', [layaway_num]);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			return res.json(results);
		})
	});
});

//FIXME TEST
//Create a new layaway item
layawayApp.post('/api/addItem/:layaway_num', (req, res, next) => {
	const results = [];
	//Data from http request
	const data = req.body.item_data;
	const layaway_num = req.params.layaway_num;

	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		//FIXME check on fields for insert statement
		client.query('INSERT INTO layaway_item(layaway_num, item_num, quantity, item_cost, description, img_url) values($1, $2, $3, $4, $5, $6);',
			[layaway_num, data.item_num, data.quantity, data.item_cost, data.description, data.img_url]).then( () => {
				addItemCost(layaway_num, data.item_cost);
			});

		const query = client.query('SELECT * FROM layaway_item WHERE layaway_num = $1', [layaway_num]);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', () => {
			done();
			return res.json(results);
		});
	});
});

function createLayaway(custNum) {
	var today = new Date();
	var cust_num = custNum;
	var layaway_num;
	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({ success: false, data: err});
		}

		client.query('INSERT INTO layaway(create_date, lpay_date, cust_num) values ($1, $2, $3);',
			[today, today, cust_num])
			.then( () => {
				layaway_num = getLayaway(cust_num);
				console.log("layaway_num at end of query in createLayaway: " + layaway_num);
				return layaway_num;
			});

		/*
		const query = client.query('SELECT layaway_num FROM layaway WHERE cust_num = $1 AND complete = false', [cust_num]);

		query.on('row', (row) => {
			console.log("What does the layaway_num response lookg like?");
			console.log(row);
		});

		query.on('end', () => {
			done();
		});
		*/

	});
}

function addItemCost(layaway_num, item_cost) {
	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
		}

		client.query('SELECT layaway_amount FROM layaway WHERE layaway_num = $1 AND complete = false;', [layaway_num])
		.then( (response) => {
			var amount = response.rows[0].layaway_amount;
			var new_amount = amount + item_cost;

			client.query('UPDATE layaway SET layaway_amount = $1 WHERE layaway_num = $2;', [new_amount, layaway_num]);
		});
	})
}

layawayApp.post('/api/addPayment/:layaway_num', (req, res, next) => {

});


//Listen on port
layawayApp.listen(8787);
console.log("App listening on port 8787");