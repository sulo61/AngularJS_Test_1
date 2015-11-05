angular.module('panelApp').controller('shopController', ['$scope', '$http', '$routeParams', '$timeout', 'Upload', 'appInfo', function($scope, $http, $routeParams, $timeout, Upload, appInfo){
	// api info
	this.appInfo = appInfo;
	// shop id
	this.id = $routeParams.id;
	// model
	this.shop = { "name": "", "opening_hours": [], "address": "", "latitude": 0, "longitude": 0 };
	this.newOpenHour = "";
	this.newCloseHour = "";
	this.newDays = [];
	// marker
	this.marker = {
      id: 0,
      coords: {
        latitude: 0,
        longitude: 0
      },
      options: { draggable: true },
      events: {
        dragend: function (marker, eventName, args) {
          $log.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          $log.log(lat);
          $log.log(lon);

          $scope.marker.options = {
            draggable: true,
            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
            labelAnchor: "100 0",
            labelClass: "marker-labels"
          };
        }
      }
    };
	// model copy
	this.copy = {};
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
	this.removeHours = function(index){
		this.shop.opening_hours.splice(index, 1);
	}
	this.dismiss = function(){
		this.shop = angular.copy(this.copy);
	}
	this.save = function(){
		this.getCoords();
	}
	this.updateMap = function(){
		this.map = { center: { latitude: this.shop.latitude, longitude: this.shop.longitude }, zoom: 16 };
		this.marker.coords.latitude = this.shop.latitude;
		this.marker.coords.longitude = this.shop.longitude;
	}
	this.makeCopy = function(){
		this.copy = angular.copy(this.shop);
	}
	// get shop
	this.getShop = function(){
		if (this.id>0){
			$http({
				method: 'GET',
				url: '/api/shops/'+this.id+"/"
			}).then(function successCallback(response){
				this.shop = response.data;
				this.updateMap();
				this.makeCopy();
			}.bind(this), function errorCallback(response){
				appInfo.showFail(response);
			}.bind(this));	
		}
	}
	// patch shop
	this.patchShop = function(){		
		$http({
			method: 'PATCH',
			url: '/api/shops/'+this.id+"/",
			data: this.shop
		}).then(function successCallback(response){
			appInfo.showSuccess();
			appInfo.setCurrentPath("Dashboard/Shop/"+this.shop.name);
			this.makeCopy();
			this.updateMap();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
				
	}
	// post shop
	this.postShop = function(){
		$http({
			method: 'POST',
			url: '/api/shops/',
			data: this.shop
		}).then(function successCallback(response){
			appInfo.showSuccess();
			appInfo.setCurrentPath("Dashboard/Shop/"+this.shop.name);
			this.shop = response.data;
			this.makeCopy();
			this.updateMap();
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));			
	}
	// get lat long
	this.getCoords = function(){
		$http({
			method: 'GET',
			url: 'http://maps.google.com/maps/api/geocode/json',
			params: {"address" : this.shop.address, "sensor": false}
		}).then(function successCallback(response){
			if (response.data.results.length>0){
				this.shop.latitude = response.data.results[0].geometry.location.lat;
				this.shop.longitude = response.data.results[0].geometry.location.lng;
			}
			if (this.id<0){
				this.patchShop();
			} else {
				this.postShop();
			}
			
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));	
	}

	this.upload = function(file) {
        Upload.upload({
            url: '/api/shops/'+this.shop.id+'/image/',
            data: {image: file}
        }).then(function (resp) {
        	debugger
            
        }, function (resp) {
        	debugger
            
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);           
        });
    };


	this.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/shops/'+this.shop.id+'/image/',
                data: {image: file}
            });
            file.upload.then(function (response) {
            	appInfo.showSuccess();
                // $timeout(function () {                	
                //     appInfo.showFail(response.data);
                // });
            }, function (response) {
                if (response.status > 0)
                	appInfo.showFail(response.status + ': ' + response.data);
            }, function (evt) {                
            });
        }   
    }


	this.getShop(this.id);
}]);