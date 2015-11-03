angular.module('panelApp').controller('basicController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
// api info
	this.appInfo = appInfo;
	// campaign params
	this.id = $routeParams.id;
	this.name = $routeParams.name;
	// model
	this.basic = {id:"", name:"", start_date:"", end_date:""};
	this.basicCopy = {};
	// save
	this.save = function(){
		this.saveBasic();
	}
	// dismiss
	this.dismiss = function(){
		this.basic = angular.copy(this.basicCopy);
	}
	// copy
	this.makeCopy = function(response){
		this.basicCopy = angular.copy(this.basic);		
		appInfo.setCurrentPath("Dashboard/Campaign/"+this.name+'/Basic information');
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
			this.id = this.basic.id;
			this.name = this.basic.name;	
			this.makeCopy();
			appInfo.showSuccess();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	}
	this.postBasic = function(){
		$http({
			method: 'POST',
			url: '/campaigns/',
			data: this.basic
		}).then(function successCallback(response){
			this.id = response.data.id;
			this.name = response.data.name;
			this.makeCopy();
			appInfo.showSuccess();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	}
	this.saveBasic = function(){
		if (this.id>0){
			this.patchBasic();
		} else {
			this.postBasic();
		}
	}	
	this.getBasic();


}]);