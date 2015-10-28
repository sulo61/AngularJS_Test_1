angular.module('panelApp').controller('dashProfileController', ['$scope', '$http', 'apiInfo', function($scope, $http, apiInfo){
	// api info
	this.apiInfo = apiInfo;
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
		$http({
			method: 'GET',
			url: '/user/'
		}).then(function successCallback(response){
			this.user = response.data;
			this.userBackup = angular.copy(this.user);
		}.bind(this), function errorCallback(response){
			apiInfo.showFail(response);
		});
	};
	
	// update user
	this.pathUser = function(){
		$http({
			method: 'PATCH',
			url: '/user/'+this.user.id+'/',
			data: this.user
		}).then(function successCallback(response){
			apiInfo.showSuccess();
			this.userBackup = angular.copy(this.user);
		}.bind(this), function errorCallback(response){
			apiInfo.showFail(response);
			this.user = angular.copy(this.userBackup);
		}.bind(this));
	};

	this.getUser();

}]);