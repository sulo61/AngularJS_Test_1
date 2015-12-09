angular.module('authApp', ['toaster', 'ngAnimate']).controller('authController', function($scope, $http, $window, toaster) {
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
			if(response.status==200){
				$window.location.href = "/panel/#/campaigns";
			}
			$scope.unlock();
		}, function errorCallback(response){
			$scope.unlock();
			$scope.showError(response);
		});
	};
	// register
	$scope.register = {};
	$scope.register.first_name = "";
	$scope.register.last_name = "";
	$scope.register.email = "";
	$scope.register.password = "";
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
			$scope.showLoginWithEmail(response.data.email);
			$scope.unlock();
		}, function errorCallback(response){
			$scope.unlock();
			$scope.showError(response);
		});
	};

	$scope.lock = function(){
		$scope.isLock = true;
	}
	$scope.unlock = function(){
		$scope.isLock = false;
	}




	$scope.showSuccess = function () {
		toaster.pop({
			type: 'success',
			title: 'Success',
			body: '',
			showCloseButton: true,
			timeout: 2000
		});
	}
	$scope.showError = function(error){
		toaster.pop({
			type: 'error',
			title: 'Error',
			body: error,
			showCloseButton: true,
			timeout: 2000
		});
	}
});


