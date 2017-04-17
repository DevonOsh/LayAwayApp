app.controller("empCtrl", function($scope){
	$scope.message = "Connected to empCtrl";

	$scope.formData = {};

	$scope.addItem = function() {
		$http.post('/api/addItem', $scope.formData).then(success, error);
	};

	function success(response) {
		alert("Success!");
		alert(response);
	}

	function error(err) {
		console.log("Error: " + err);
	}
});

app.controller("empLoginCtrl", function($scope, $location) {
	$scope.login = function() {
		alert('Navigating from view..');
		$location.path('/empHome');
	};
});
