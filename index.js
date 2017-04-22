var express = require('express');
var layawayApp = express();
var bodyParser = require('body-parser');
var pg = require('pg');

//PostgreSQL connection data
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

//APIs for customer section

layawayApp.post('/api/getCustNum', (req, res, next) => {
	const results = [];
	const username = req.body.username;
	const password = req.body.password;

	 pg.connect(conString, (err, client, done) => {
	    if(err) {
	      done();
	      console.log(err);
	      return res.status(500).json({success: false, data: err});
	    }

	    const query = client.query('SELECT cust_num FROM customer WHERE username = $1 AND password = $2;', [username, password]);

	    query.on('row', (row) => {
	      results.push(row);
	    });

	    query.on('error', () => {
	    	done();
	    	return res.status(500).json( { success: false, data: "Invalid username or password "});
	    })

	    query.on('end', () => {
	      done();
	      return res.json(results);
	    });
	 });

});

//Get user info after successful login
layawayApp.put('/api/getUserInfo/:cust_num', (req, res, next) => {
	const results = [];
	const cust_num = req.params.cust_num;

	pg.connect(conString, (err, client, done) => {
	    if(err) {
	      done();
	      console.log(err);
	      return res.status(500).json({success: false, data: err});
	    }

	    const query = client.query('SELECT * FROM customer WHERE cust_num = $1;', [cust_num]);

	    query.on('row', (row) => {
	      results.push(row);
	    });

	    query.on('end', () => {
	      done();
	      return res.json(results);
	    });
	});
});

//Get users layaway
layawayApp.put('/api/getLayaway/:cust_num', (req, res, next) => {
	const results = [];
	const cust_num = req.params.cust_num;

	pg.connect(conString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		const query = client.query('SELECT * from layaway WHERE cust_num = $1 AND complete = false;', [cust_num]);

		query.on('error', function(error) {
			console.log("There was an error getting layaway...");
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


//APIS for employee section
//Get all customers, I know bad name
layawayApp.get('/api/getUser', (req, res, next) => {
  const results = [];

  pg.connect(conString, (err, client, done) => {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    const query = client.query('SELECT * FROM customer;');

    query.on('row', (row) => {
      results.push(row);
    });

    query.on('end', () => {
      done();
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

layawayApp.put('/api/getLayawayAmount/:cust_num', (req, res, next) => {
	const results = [];
	const cust_num = req.params.cust_num;

	console.log("Running getLayawayAmount...");
	console.log("Cust num sent from client: " + cust_num);

	pg.connect(conString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		const query = client.query('SELECT layaway_amount from layaway WHERE cust_num = $1 AND complete = false;', [cust_num]);

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

layawayApp.post('/api/addPayment/:layaway_num', (req, res, next) => {
	const results = [];
	const layaway_num = req.params.layaway_num;
	const payment = req.body.data;
	const today = new Date();

	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
		}

		client.query('SELECT layaway_amount FROM layaway WHERE layaway_num = $1 AND complete = false;', [layaway_num])
		.then( (response) => {
			var amount_response = response.rows[0].layaway_amount;
			var amount_string = amount_response.substr(1);
			var amount = parseFloat(amount_string);
			var new_amount = amount - payment;

			client.query('UPDATE layaway SET layaway_amount = $1, lpay_date = $2 WHERE layaway_num = $3;', [new_amount, today, layaway_num])
			.then( () => {
				checkLayaway(layaway_num);
			});
		});
	});
});

function checkLayaway(layaway_num) {
	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
		}

		client.query('SELECT layaway_amount FROM layaway WHERE layaway_num = $1;', [layaway_num])
		.then( (response) => {
			var amount_response = response.rows[0].layaway_amount;
			var amount_string = amount_response.substr(1);
			var amount = parseFloat(amount_string);

			if (amount <= 0) {
				//Layaway has been paid, set complete to false
				client.query('UPDATE layaway SET complete = true WHERE layaway_num = $1;', [layaway_num]);
			}
		});
	});
}

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
	});
}

function addItemCost(layaway_num, itemCost) {
	var item_cost = parseFloat(itemCost);

	pg.connect(conString, (err, client, done) => {
		if (err) {
			done();
			console.log(err);
		}

		client.query('SELECT layaway_amount FROM layaway WHERE layaway_num = $1 AND complete = false;', [layaway_num])
		.then( (response) => {
			var amountResponse = response.rows[0].layaway_amount;
			var amountString = amountResponse.substr(1);
			var amount = parseFloat(amountString);
			var new_amount = amount + item_cost;

			client.query('UPDATE layaway SET layaway_amount = $1 WHERE layaway_num = $2;', [new_amount, layaway_num]);
		});
	});
}


//Listen on port
layawayApp.listen(8787);
console.log("App listening on port 8787");