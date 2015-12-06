angular.module('panelApp').controller('campaignBeaconsController', ['$routeParams', 'CampaignBeacons', 'CampaignBeacon', 'currentPath', 'toast', 'campaignMENU', function($routeParams, CampaignBeacons, CampaignBeacon, currentPath, toast, campaignMENU){
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
    // campaign params
    this.id = $routeParams.id;
    this.campaignM = campaignMENU;
    this.campaignM.setID(this.id>0?this.id:0);
    // models
    this.beaconsList = [];
    this.beaconsPages = [];	// numbers
    this.beaconsCurrentPage = 1;
    this.numberOfItems = 0;
    this.perPage = 5;
    // nav
    this.beaconsNavActive = function(page){
        if (page==this.beaconsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.beaconsNavNext = function(){
        if (this.beaconsCurrentPage<this.beaconsPages.length){
            this.getBeacons(this.beaconsCurrentPage+1);
        }
    };
    this.beaconsNavPrev = function(){
        if (this.beaconsCurrentPage>1){
            this.getBeacons(this.beaconsCurrentPage-1);
        }
    };
    // api
    this.getBeacons = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }


        CampaignBeacons.get({campaignID:this.id, page:page, pagination:true}, function(success){
            this.beaconsList = [];
            this.beaconsPages = [];
            this.beaconsList = success.results;
            this.numberOfItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfItems/this.perPage)); i++) {
                this.beaconsPages.push(i+1);
            }
            this.beaconsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            appInfo.showFail(error);
            this.unlock();
        }.bind(this));

    };
    this.deleteBeacon = function(beaconID){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        CampaignBeacon.delete({campaignID:this.id, beaconID:beaconID}, function(){
            this.numberOfItems = this.numberOfItems - 1;
            if ( (this.numberOfItems <= (this.beaconsCurrentPage-1) * this.perPage) && this.numberOfItems>=this.perPage ){
                this.beaconsCurrentPage = this.beaconsCurrentPage - 1;
            }
            this.unlock();
            this.getBeacons(this.beaconsCurrentPage);
        }.bind(this), function(error){
            this.unlock();
        }.bind(this));
    }

    this.getBeacons(1);

}]);