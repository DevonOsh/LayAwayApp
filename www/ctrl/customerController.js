app.controller("custLoginCtrl", function($scope, $http, $location) {

	$scope.login = function() {
		var loginUrl = '/api/getCustNum';
		var data = {
			username: $scope.username,
			password: $scope.password
		}
		$http.post(loginUrl, data).then(success, error);

		function success(response) {
			cust_num = response.data[0].cust_num;
			$location.path('/custHome/' + cust_num);
		}

		function error(err) {
			alert("Unable to login: " + err);
		}
	}
});

app.controller("custCtrl", function($scope, $http, $routeParams) {
	$scope.cust_num = $routeParams.cust_num;

	//cust_data, layaway_data, layaway_items
	var custDataUrl = '/api/getUserInfo/' + $routeParams.cust_num;
	var layawayUrl = '/api/getLayaway/' + $routeParams.cust_num;

	$http.put(custDataUrl).then(custSuccess, error);
	$http.put(layawayUrl).then(lwaySuccess, error);

	function custSuccess(response) {
		$scope.customer = response.data[0];
	}

	function lwaySuccess(response) {
		$scope.layaway = response.data[0];
		var layaway_num = response.data[0].layaway_num;
		var itemUrl = '/api/getItems/' + layaway_num;

		$http.put(itemUrl).then( (response) => {
			$scope.items = response.data;
		},
		error);
	}

	function error(err) {
		console.log(err);
	}

});