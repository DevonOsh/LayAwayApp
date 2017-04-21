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

layawayApp.get('*', function(request, response) {
	response.sendFile('./www/index.html');
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

//Create a new customer
layawayApp.post('/api/addCust', (req, res, next) => {
	const results = [];
	//Grab customer data from body of request
	const custData = req.body.data;
	console.log(custData);

	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		//Create an empty layaway for the customer
		createLayaway(custData.cust_num);
		//Insert custData into the customer table
		client.query('INSERT INTO customer(cust_num, f_name, l_name, e_mail, username, password) values ($1, $2, $3, $4, $5, $6);', 
			[custData.cust_num, custData.f_name, custData.l_name, custData.e_mail, custData.username, custData.password]);
		//Select all customers from the table and send them back to the client
		const query = client.query('SELECT * FROM customer');

		query.on('row', (row) => {
			results.push(row);
		});
		//Results array of customers
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
			[today, today, cust_num]);

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

		layaway_num = getLayaway(cust_num);
		return layaway_num;

	});
}

function getLayaway(custNum) {
	var cust_num = custNum;
	var layawayNum;

	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		client.query('SELECT layaway_num FROM layaway WHERE cust_num = $1 AND complete = false', [cust_num]);

		query.on('row', (row, result) => {
			result.addRow(row);
		});

		query.on('end', function(result) {
			done();
			if (result.rows.length < 1) {
				console.log("Error: Customer has multiple layaways.");
			}
			else {
				layawayNum = result.rows[0].layaway_num;
				return layawayNum;
			}
		})
	});
}

//FIXME TEST
//Create a new layaway item
layawayApp.post('/api/addItem', (req, res, next) => {
	const results = [];
	//Data from http request
	const data = req.body.item_data;
	const cust_num = req.body.cust_num;

	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		//FIXME check on fields for insert statement
		client.query('INSERT INTO layaway_item(layaway_num, item_num, quantity, item_cost, description, img_url) values($1, $2, $3, $4, $5, $6);',
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

layawayApp.post('/api/addPayment', (req, res, next) => {

})

function updateLayaway(data) {
	//Needs layaway num
	//If update data is item data, needs item cost
	//		Then needs to find the layaway and return the amount
	//		Creat new amount from amaount = amount + item cost
	//		Update layaway amount field to new value

	//If update data is payment data, needs payment amount
	//		Find layaway and return amount
	//		Create new amount from amount = amount - payment
	//		Update layaway amount field with new value
}


//Listen on port
layawayApp.listen(8787);
console.log("App listening on port 8787");