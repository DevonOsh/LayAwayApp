app.controller("myCtrl", function($scope) {
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
});