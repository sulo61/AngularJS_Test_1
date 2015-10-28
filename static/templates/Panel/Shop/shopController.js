angular.module('panelApp').controller('shopController', ['$scope', '$http', '$routeParams', 'apiInfo', function($scope, $http, $routeParams, apiInfo){
	// api info
	this.apiInfo = apiInfo;
	// shop id
	this.id = $routeParams.id;
	// model
	this.shop = {};
	this.newOpenHour = "";
	this.newCloseHour = "";
	this.newDays = [];
	// tmp copy of shop
	this.tmpCopy = {};
	// hours
	this.addNewHourVisible = true;
	this.sendNewHourVisible = false;
	this.showAddNewHours = function(){
		this.addNewHourVisible = false;
		this.sendNewHourVisible = true;
	}
	this.postNewHours = function(){
		this.addNewHourVisible = true;
		this.sendNewHourVisible = false;

		this.shop.opening_hours.push( {days: this.newDays.split(",").map(Number), open_time: this.newOpenHour, close_time: this.newCloseHour} );

		this.newOpenHour = "";
		this.newCloseHour = "";
		this.newDays = [];
	}
	// get shop
	this.getShop = function(){
		if (this.id>0){
			$http({
				method: 'GET',
				url: '/shops/'+this.id+"/"
			}).then(function successCallback(response){
				this.shop = response.data;
				this.map = { center: { latitude: this.shop.latitude, longitude: this.shop.longitude }, zoom: 8 };
				this.tmpCopy = angular.copy(this.shop) ;
			}.bind(this), function errorCallback(response){
				apiInfo.showFail(response);
			}.bind(this));	
		}
	}
	// patch shop
	this.patchShop = function(){		
		$http({
			method: 'PATCH',
			url: '/shops/'+this.id+"/",
			data: this.shop
		}).then(function successCallback(response){
			apiInfo.showSuccess();
		}.bind(this), function errorCallback(response){
			this.shop = angular.copy(this.tmpCopy);
			apiInfo.showFail(response);
		}.bind(this));			
				
	}
	// post shop
	this.postShop = function(){
		$http({
			method: 'POST',
			url: '/shops/',
			data: this.shop
		}).then(function successCallback(response){
			apiInfo.showSuccess();
		}.bind(this), function errorCallback(response){
			this.shop = angular.copy(this.tmpCopy);
			apiInfo.showFail(response);
		}.bind(this));			
	}

	this.getShop(this.id);
}]);