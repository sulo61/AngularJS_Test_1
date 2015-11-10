angular.module('panelApp').controller('dashProfileController', ['$scope', '$http', 'appInfo', function($scope, $http, appInfo){
	// lock
	this.isLock = false;
	this.lock = function(){
		this.isLock = true;
	}
	this.unlock = function(){
		this.isLock = false;
	}
	// api info
	this.appInfo = appInfo;
	// model user
	this.user = {};
	this.first_name = "";
	this.last_name = "";
	this.email = "";
	this.password = ""
	this.id = -1;
	this.userBackup = {}
	
	// api
	// get user
	this.getUser = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'GET',
			url: '/api/user/'
		}).then(function successCallback(response){
			this.user = response.data;
			this.userBackup = angular.copy(this.user);
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		});
	};
	
	// update user
	this.pathUser = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'PATCH',
			url: '/api/user/'+this.user.id+'/',
			data: this.user
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.user.password = "";
			this.user.old_password = "";
			this.userBackup = angular.copy(this.user);
			this.unlock();			
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.user = angular.copy(this.userBackup);
			this.unlock();
		}.bind(this));
	};

	this.getUser();

}]);