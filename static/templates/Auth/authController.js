angular.module('authApp', []).controller('authController', function($scope, $http, $window) {
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
	$scope.showLoginWithEmail = function(email){
		$scope.welcomeVisible = false;
		$scope.loginVisible = true;
		$scope.registerVisible = false;
		$scope.login.email = email;
		$scope.login.password = "";
	}
	$scope.showRegister = function(){
		$scope.welcomeVisible = false;
		$scope.loginVisible = false;
		$scope.registerVisible = true;
	}
	$scope.showWelcome();
	// login
	$scope.login = {};
	$scope.login.email = "sulo612@gmail.com";
	$scope.login.password = "123";
	$scope.showLoginWarning = false;
	$scope.loginWarning = "";
	$scope.signin = function(){
		$scope.showWarning = false
		$http({
			method: 'POST',
			url: '/login/',
			data: $scope.login
		}).then(function success5Callback(response){
			$scope.showLoginWarning = false;
			$scope.loginWarning = "";
			if(response.status==200){
				$window.location.href = "/panel";
			}
		}, function errorCallback(response){
			$scope.showLoginWarning = true;
			$scope.loginWarning = response;
		});	
	};
	// register
	$scope.register = {};
	$scope.register.first_name = "";
	$scope.register.last_name = "";
	$scope.register.email = "";
	$scope.register.password = "";
	$scope.showRegisterWarning = false;
	$scope.registerWarning = "";
	$scope.signup = function(){
		$scope.showWarning = false
		$http({
			method: 'POST',
			url: '/register/',
			data: $scope.register
		}).then(function successCallback(response){
			$scope.showRegisterWarning = false;
			$scope.registerWarning = "";
			$scope.showLoginWithEmail(response.data.email);
		}, function errorCallback(response){
			$scope.showRegisterWarning = true;
			$scope.registerWarning = response;
		});	
	};	
});


