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
			$scope.customers = response.data;
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

	var url = 'api/getLayaway/' + $scope.custNum;
	var addItemUrl = 'api/addItem';
	var addPaymentUrl = 'api/addPayment';

	$http.put(url).then(success, error);

	function success(response) {
		var layawayNum = response.data[0].layaway_num;
		console.log("Successful response from getLayaway, first entry: " + layawayNum);	//FIXME remove
	}
	function error(err) {
		alert(err);		//FIXME remove
	}

	$scope.addItem = function() {
		var addItemData = { item_data: $scope.itemData, cust_num: $scope.custNum };

		$http.post(addItemUrl, addItemData).then(success, error);
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