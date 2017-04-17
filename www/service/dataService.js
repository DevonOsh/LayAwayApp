app.service('lwayService', function($http) {
	var getCustomers = function() {
		var customers = [];

		$http.get('api/getUser').then(success, error);

		function success(response) {
			console.log(response);
			customers = response.data;
		}

		function error(err) {
			console.log("Error: " + err);
		}

		return customers;
	};

	var addCustomer = function(customer) {

	};

	var getLways = function(custNum) {

	};

	var addLway = function(lway) {

	};

	var updateLway = function(lwayNum) {

	};

	var addItem = function(item) {

	};

	var deleteItem = function(itemNum) {

	};

	return {
		getCustomers: getCustomers,
		addCustomer: addCustomer,
		getLways: getLways,
		addLway: addLway,
		updateLway: updateLway,
		addItem: addItem,
		deleteItem: deleteItem
	}
});