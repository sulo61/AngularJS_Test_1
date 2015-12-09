angular.module('panelAuth', [ 'ngRoute'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.when("/", {
				templateUrl: "/login",
				controller: "authController",
				controllerAs: 'authCtrl'
			})
			.when("/auth/login", {
				templateUrl: "/login",
				controller: "authController",
				controllerAs: 'authCtrl'
			})
			.when("/auth/register", {
				templateUrl: "/register",
				controller: "authController",
				controllerAs: 'authCtrl'
			})
	}])
	.controller('authController', function($http, $window) {
		this.isLock = false;
		this.lock = function(){
			this.isLock = true;
		}
		this.unlock = function(){
			this.isLock = false;
		}

		// login
		this.login = {};
		this.login.email = "sulo612+2@gmail.com";
		this.login.password = "123";
		this.signin = function(){
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			$http({
				method: 'POST',
				url: '/auth/',
				data: this.login
			}).then(function successCallback(response){
				if(response.status==200){
					$window.location.href = "/panel/#/campaigns";
				}
				this.unlock();
			}.bind(this), function errorCallback(){
				this.unlock();
			}.bind(this));
		};
		// register
		this.register = {};
		this.register.first_name = "";
		this.register.last_name = "";
		this.register.email = "";
		this.register.password = "";
		this.signup = function(){
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			$http({
				method: 'POST',
				url: '/api/operator/register/',
				data: this.register
			}).then(function successCallback(response){
				if(response.status==201){
					$window.location.href = "#/auth/login";
				}
				this.unlock();
			}.bind(this), function errorCallback(){
				this.unlock();
			}.bind(this));
		};

	});
