app.controller("empCtrl", function($scope){
	$scope.message = "Connected to empCtrl";

	$scope.getCutsomers = function() {
		$http.get('api/getUser').then(success, error);
	}

	function success(response) {
		alert("Successful getting customers.");	//FIXME remove
		$scope.customers = response.data;
	}

	function error(err) {

	}
});

app.controller("empLoginCtrl", function($scope, $location) {
	$scope.login = function() {
		alert('Navigating from view..');	//FIXME remove
		$location.path('/empHome');
	};

});

app.controller('custLwayCtrl', function($scope, $http, $routeParams) {
	var custNum = $routeParams.cust_num;

	$http.get('api/getLayAway', { params: custNum }).then(success, error);

	function success(response) {
		var layawayNum = response.data[0].layawayNum;
		alert("Successful response from getLayaway, first entry: " + layawayNum);	//FIXME remove
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