app.controller("empCtrl", function($scope, $http){
	$scope.message = "Connected to empCtrl";

	$http.get('api/getUser').then(userSuccess, userError);
	
	function userSuccess(response) {
		console.log("Successful getting customers.");	//FIXME remove
		console.log(response.data);
		$scope.customers = response.data;
	}

	function userError(error) {
		console.log(error);
	}

	//Create new user
	$scope.addCustomer = function() {
		console.log($scope.custData);
		$http.post('api/addCust', { data: $scope.custData }).then(addCustSuccess, addCustError);

		function addCustSuccess(response) {
			$scope.customers = response.data.customers;
			//FIXME remove
			console.log(response.data.layaway_num);
		}

		function addCustError(error) {
			console.log(error);
		}
	};
});

app.controller("empLoginCtrl", function($scope, $location) {
	$scope.login = function() {
		$location.path('/empHome');
	};

});

app.controller("custLwayCtrl", function($scope, $http, $routeParams) {
	$scope.custNum = $routeParams.cust_num;
	console.log("Type of cust num: ");
	console.log(typeof $scope.cust_num);

	var url = 'api/getLayawayNum/' + $scope.custNum;
	var addItemUrl;
	var addPaymentUrl;
	var getItemsUrl;
	var layaway_num; //Get with it's own api, then use with the above urls to pass and update data

	$http.put(url)
	.then(success, error)
	.then( () => {
		console.log("Type of layaway num: ");
		console.log(typeof layaway_num);
		addItemUrl = 'api/addItem/' + layaway_num;
		addPaymentUrl = 'api/addPayment/' + layaway_num;
		getItemsUrl = 'api/getItems/' + layaway_num;

		$http.put(getItemsUrl).then( (response) => {
			$scope.items = response.data;
		}, (error) => {
			console.log(error);
		});
	});

	function success(response) {
		layaway_num = response.data[0].layaway_num;
	}
	function error(err) {
		alert(err);		//FIXME remove
	}

	$scope.addItem = function() {
		alert("Running addItem");
		var itemData = { item_data: $scope.itemData };

		$http.post(addItemUrl, itemData).then(success, error);

		function success(response) {
			//FIXME remove
			console.log(response.data);
			$scope.items = response.data;
		}

		function error(err) {
			console.log(err);
		}
	}

	$scope.addPayment = function() {
		var paymentData = { payment: $scope.paymentAmount, cust_num: $scope.custNum };

		$http.post(addPaymentUrl, paymentData).then(success, error);
	}
});

//Old New Item controller
//FIXME Delete
/*
app.controller("newItemCtrl", function($scope, $http) {
	$scope.formData = {};

	$scope.addItem = function() {
		$http.post('/api/addItem', $scope.formData).then(success, error);
	};

	function success(response) {
		alert("Success from addItem!");	//FIXME remove
		alert(response);
	}

	function error(err) {
		console.log("Error: " + err);
	}
})
*/