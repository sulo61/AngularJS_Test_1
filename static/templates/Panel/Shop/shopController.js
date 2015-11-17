angular.module('panelApp').controller('shopController', ['$scope', '$http', '$routeParams', '$timeout', 'Upload', 'appInfo', 'Shop', 'Shops', 'GoogleCoords', function($scope, $http, $routeParams, $timeout, Upload, appInfo, Shop, Shops, GoogleCoords){
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
			if (this.isLock){
				return;
			} else {
				this.lock();
			}
			Shop.get({shopID:this.id}, function(success){
				this.shop = success;
				this.updateMap();
				this.makeCopy();
				this.unlock();
			}.bind(this), function(error){
				this.appInfo.showFail(error);
				this.unlock();
			}.bind(this));
		}
	}
	// patch shop
	this.patchShop = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}
		Shop.patch({shopID:this.id}, this.shop, function(){
			appInfo.showSuccess();
			this.makeCopy();
			this.updateMap();
			this.unlock();
		}.bind(this), function(error){
			appInfo.showFail(error);
			this.unlock();
		}.bind(this));
				
	}
	// post shop
	this.postShop = function(){
		if (this.isLock){
			return;
		} else {
			this.lock();
		}

		Shops.save(this.shop, function(success){
			this.appInfo.showSuccess();
			this.shop = success;
			this.id = this.shop.id;
			this.makeCopy();
			this.updateMap();
			this.unlock();
		}.bind(this), function(error){
			this.appInfo.showFail(error);
			this.unlock();
		}.bind(this));

	}
	// get lat long
	this.getCoords = function(){
		GoogleCoords.get({"address" : this.shop.address, "sensor": false}, function(success){
			if (success.results.length>0){
				this.shop.latitude = success.results[0].geometry.location.lat;
				this.shop.longitude = success.results[0].geometry.location.lng;
			}
			if (this.id>0){
				this.patchShop();
			} else {
				this.postShop();
			}
		}.bind(this), function (error) {
			this.appInfo.showFail(error);
		}.bind(this));
	}
	// upload photo	
	this.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/shops/'+this.shop.id+'/image/',
                data: {image: file}
            });
            file.upload.then(function (response) {
            	this.shop.image = angular.copy(response.data.image);
            	appInfo.showSuccess();
                // $timeout(function () {                	
                //     appInfo.showFail(response.data);
                // });
            }.bind(this), function (response) {
            	if (response.status > 0)
                	appInfo.showFail(response.status + ': ' + response.data);
            }, function (evt) {                
            });
        }   
    }

	this.getShop(this.id);
}]);