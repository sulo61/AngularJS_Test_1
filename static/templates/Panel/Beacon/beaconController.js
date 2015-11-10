angular.module('panelApp').controller('beaconController', ['$scope', '$http', '$routeParams', '$timeout', 'Upload', 'appInfo', function($scope, $http, $routeParams, $timeout, Upload, appInfo){
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
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			$http({
				method: 'GET',
				url: '/api/beacons/'+this.id+"/"
			}).then(function successCallback(response){
				this.beacon = response.data;
				this.makeCopy();
				this.unlock();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
				this.unlock();
			}.bind(this));	
		}
	}
	// patch beacon
	this.patchBeacon = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}		
		$http({
			method: 'PATCH',
			url: '/api/beacons/'+this.id+"/",
			data: this.beacon
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.makeCopy();
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		}.bind(this));			
				
	}
	// post beacon
	this.postBeacon = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		$http({
			method: 'POST',
			url: '/api/beacons/',
			data: this.beacon
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.beacon = response.data;
			this.makeCopy();
			this.unlock();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
			this.unlock();
		}.bind(this));			
	}

	this.getBeacon(this.id);
}]);