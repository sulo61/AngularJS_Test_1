angular.module('panelApp').controller('beaconController', ['$scope', '$http', '$routeParams', '$timeout', 'Upload', 'appInfo', function($scope, $http, $routeParams, $timeout, Upload, appInfo){
	// api info
	this.appInfo = appInfo;
	// beacon id
	this.id = $routeParams.id;
	// model
	this.beacon = { title:"", minor:"", major:"" };
	this.copy = {};
	// dismiss
	this.dismiss = function(){
		this.beacon = angular.copy(this.copy);
	}
	this.save = function(){
		if (this.id>0){
			this.patchBeacon();
		} else {
			this.postBeacon();
		}
	}
	this.makeCopy = function(){
		this.copy = angular.copy(this.beacon);
	}
	// get beacon
	this.getBeacon = function(){
		if (this.id>0){
			$http({
				method: 'GET',
				url: '/api/beacons/'+this.id+"/"
			}).then(function successCallback(response){
				this.beacon = response.data;
				this.makeCopy();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
			}.bind(this));	
		}
	}
	// patch beacon
	this.patchBeacon = function(){		
		$http({
			method: 'PATCH',
			url: '/api/beacons/'+this.id+"/",
			data: this.beacon
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.makeCopy();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
				
	}
	// post beacon
	this.postBeacon = function(){
		$http({
			method: 'POST',
			url: '/api/beacons/',
			data: this.beacon
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.beacon = response.data;
			this.makeCopy();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
	}

	this.getBeacon(this.id);
}]);