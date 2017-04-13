var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateURL: "views/main.html"
		//controller: "ctrl/main.js"
	})
	.when("/employee", {
		templateURL: "views/empHome.html"
		//controller: "ctrl/empHome.js"
	})
	.when("/customer", {
		templateURL: "customerHome.html"
		//controller: "ctrl/customerHome.js"
	});
});