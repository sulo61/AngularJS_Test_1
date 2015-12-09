angular.module('authApp', []).controller('authController', function($scope, $http, $window) {
	$scope.isLock = false;
	// nav
	$scope.loginVisible = true;
	$scope.registerVisible = false;
	$scope.showLogin = function(){
		$scope.loginVisible = true;
		$scope.registerVisible = false;
	}
	$scope.showLoginWithEmail = function(email){
		$scope.loginVisible = true;
		$scope.registerVisible = false;
		$scope.login.email = email;
		$scope.login.password = "";
	}
	$scope.showRegister = function(){
		$scope.loginVisible = false;
		$scope.registerVisible = true;
	}
	$scope.showLogin();
	// login
	$scope.login = {};
	$scope.login.email = "sulo612+2@gmail.com";
	$scope.login.password = "123";
	$scope.showLoginWarning = false;
	$scope.loginWarning = "";
	$scope.signin = function(){
		if ($scope.isLock){
			return;
		} else {
			$scope.lock();
		}
		$scope.lock();
		$scope.showWarning = false
		$http({
			method: 'POST',
			url: '/login/',
			data: $scope.login
		}).then(function success5Callback(response){
			$scope.showLoginWarning = false;
			$scope.loginWarning = "";
			if(response.status==200){
				$window.location.href = "/panel/#/campaigns";
			}
			$scope.unlock();
		}, function errorCallback(response){
			$scope.showLoginWarning = true;
			$scope.loginWarning = response;
			$scope.unlock();
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
		if ($scope.isLock){
			return;
		} else {
			$scope.lock();
		}
		$scope.showWarning = false
		$http({
			method: 'POST',
			url: '/api/operator/register/',
			data: $scope.register
		}).then(function successCallback(response){
			$scope.showRegisterWarning = false;
			$scope.registerWarning = "";
			$scope.showLoginWithEmail(response.data.email);
			$scope.unlock();
		}, function errorCallback(response){
			$scope.showRegisterWarning = true;
			$scope.registerWarning = response;
			$scope.unlock();
		});
	};

	$scope.lock = function(){
		$scope.isLock = true;
	}
	$scope.unlock = function(){
		$scope.isLock = false;
	}
});


