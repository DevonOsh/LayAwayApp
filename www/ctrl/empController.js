app.controller("empCtrl", function($scope, $http){
	$scope.message = "Connected to empCtrl";

	$http.get('api/getUser').then(success, error);
	
	function success(response) {
		console.log("Successful getting customers.");	//FIXME remove
		console.log(response.data);
		$scope.customers = response.data;
	}

	function error(err) {
		console.log(err);
	}
});

app.controller("empLoginCtrl", function($scope, $location) {
	$scope.login = function() {
		$location.path('/empHome');
	};

});

app.controller("custLwayCtrl", function($scope, $http, $routeParams) {
	$scope.custNum = $routeParams.cust_num;

	var url = 'api/getLayaway/' + $scope.custNum;

	$http.put(url).then(success, error);

	function success(response) {
		var layawayNum = response.data[0].layaway_num;
		console.log("Successful response from getLayaway, first entry: " + layawayNum);	//FIXME remove
	}
	function error(err) {
		alert(err);		//FIXME remove
	}
});

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