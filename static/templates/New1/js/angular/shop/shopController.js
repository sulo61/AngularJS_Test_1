angular.module('panelApp').controller('shopController', ['$scope', '$http', '$routeParams', '$timeout', 'Upload', 'currentPath', 'toast', 'Shop', 'Shops', 'GoogleCoords', function($scope, $http, $routeParams, $timeout, Upload, currentPath, toast, Shop, Shops, GoogleCoords){
    // lock
    this.isLock = false;
    this.lock = function(){
        this.isLock = true;
    }
    this.unlock = function(){
        this.isLock = false;
    }
    // api info
    this.currentPath = currentPath;
    this.toast = toast;
    // shop id
    this.id = $routeParams.id;
    // model
    this.shop = { "name": "", "opening_hours": [], "address": "", "latitude": 0, "longitude": 0 };
    this.newOpenHour = "";
    this.newCloseHour = "";
    this.newDays = [];
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

        this.shop.opening_hours.push( {days: this.newDays, open_time: this.newOpenHour, close_time: this.newCloseHour} );

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
    this.makeCopy = function(){
        this.copy = angular.copy(this.shop);
    }
    this.getCoordsArray = function () {
        return [this.shop.latitude, this.shop.longitude];
    }
    this.updatePath = function () {
        this.currentPath.setPath("Shops / "+this.shop.name);
        this.currentPath.setPage(this.shop.name);
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
                this.makeCopy();
                this.unlock();
                this.updatePath();
            }.bind(this), function(error){
                this.unlock();
                this.toast.showError(error);
            }.bind(this));
        } else {
            this.currentPath.setPath("Shops / New shop");
            this.currentPath.setPage("New shop");
        }
    }
    // patch shop
    this.patchShop = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        debugger

        Shop.patch({shopID:this.id}, this.shop, function(){
            this.makeCopy();
            this.unlock();
            this.updatePath();
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.unlock();
            this.toast.showError(error);
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
            this.shop = success;
            this.id = this.shop.id;
            this.makeCopy();
            this.unlock();
            this.updatePath();
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.unlock();
            this.toast.showError(error);
        }.bind(this));

    }
    // get lat long
    this.getCoords = function(){
        GoogleCoords.get({"address" : this.shop.address}, function(success){
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
            this.toast.showError(error);
        }.bind(this));
    }

    this.getShop(this.id);
}]);