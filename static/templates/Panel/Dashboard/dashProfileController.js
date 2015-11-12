angular.module('panelApp').controller('dashProfileController', ['$scope', '$http', 'appInfo', 'User', function($scope, $http, appInfo, User){
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
		User.get(function(user) {
			this.user = angular.copy(user);
			this.userBackup = angular.copy(user);
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
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

		User.patch({userID:this.user.id}, this.user, function(){
			appInfo.showSuccess();
			this.user.password = "";
			this.user.old_password = "";
			this.userBackup = angular.copy(this.user);
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.user = angular.copy(this.userBackup);
			this.unlock();
		}.bind(this));

	};

	this.getUser();

}]);