angular.module('app-auth', []).controller('app-controller', function($scope, $http) {
	// nav
	$scope.welcomeVisible = true;
	$scope.loginVisible = false;
	$scope.registerVisible = false;
	$scope.showWelcome = function(){
		$scope.welcomeVisible = true;
		$scope.loginVisible = false;
		$scope.registerVisible = false;
	}
	$scope.showLogin = function(){
		$scope.welcomeVisible = false;
		$scope.loginVisible = true;
		$scope.registerVisible = false;
	}
	$scope.showRegister = function(){
		$scope.welcomeVisible = false;
		$scope.loginVisible = false;
		$scope.registerVisible = true;
	}
	$scope.showWelcome();
	// login
	$scope.login = {};
	$scope.login.email = "";
	$scope.login.password = "";
	$scope.showWarning = false;
	$scope.warning = "";
	$scope.signin = function(){
		$scope.showWarning = false
		$http({
			method: 'POST',
			url: '/login/',
			data: $scope.login
		}).then(function successCallback(response){
			$scope.showWarning = false;
			$scope.warning = "";
			alert("S");

		}, function errorCallback(response){
			$scope.showWarning = true;
			$scope.warning = response;
		});	
	};
	// register
	$scope.register = {};
	$scope.register.first_name = "";
	$scope.register.last_name = "";
	$scope.register.email = "";
	$scope.register.password = "";
	$scope.showWarning = false;
	$scope.warning = "";
	$scope.signup = function(){
		$scope.showWarning = false
		$http({
			method: 'POST',
			url: '/register/',
			data: $scope.register
		}).then(function successCallback(response){
			$scope.showWarning = false;
			$scope.warning = "";
			alert("Register success, now try login");
		}, function errorCallback(response){
			$scope.showWarning = true;
			$scope.warning = response;
		});	
	};	
});


