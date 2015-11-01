angular.module('panelApp').controller('campaignController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// shop id
	this.id = $routeParams.id;
	// visibility
	this.pageVisibility = [true, false, false, false];
	this.showPage = function(which){
		appInfo.hideApiMsg();
		this.pageVisibility = [false, false, false, false];
		this.pageVisibility[which] = true;
	}
	// model
	this.basic = {id:"", name:"", start_date:"", end_date:""};
	this.basicCopy = {};
	// save
	this.save = function(){
		switch(this.pageVisibility.indexOf(true)){
			case 0:
				this.saveBasic();
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
		}
	}
	// api
	this.getBasic = function(){
		if (this.id>0){
			$http({
				method: 'GET',
				url: '/campaigns/'+this.id
			}).then(function successCallback(response){
				this.basic = response.data;	
				this.basic.beacons = [];
				this.basicCopy = angular.copy(this.basic);
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
			});	
		}
	}
	this.patchBasic = function(){
		$http({
			method: 'PATCH',
			url: '/campaigns/'+this.id,
			data: this.basic
		}).then(function successCallback(response){
			this.basicCopy = angular.copy(this.basic);
			appInfo.showSuccess();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	}
	this.saveBasic = function(){
		if (this.id>0){
			this.patchBasic();
		}
	}	
	this.getBasic();

	this.getAwards = function(){

	}
}]);