app.controller("myCtrl", function($scope, $http) {
	$scope.user = {
		"firstName": "Devon",
		"lastName": "O'Shaughnessy"
	}
	$scope.items = [
		{
			"layawayNum": "111111",
			"itemNum": "123",
			"quantity": "1",
			"description": "Boots",
			"itemCost": 100.00
		},
		{
			"layawayNum": "111111",
			"itemNum": "234",
			"quantity": "1",
			"description": "Board",
			"itemCost": 300.00
		},
		{
			"layawayNum": "111111",
			"itemNum": "345",
			"quantity": "1",
			"description": "Bindings",
			"itemCost": 150.00
		}
	]

/*   FIXME Delete if following code works
	$http.get('api/getUser')
	.success(function(data) {
		console.log(data);
	})
	.error(function(data) {
		console.log("Error: " + data);
	});
*/

	$http.get('api/getUser').then(success, error);

	function success(response) {
		console.log(response);
	}

	function error(err) {
		console.log("Error: " + err);
	}
});