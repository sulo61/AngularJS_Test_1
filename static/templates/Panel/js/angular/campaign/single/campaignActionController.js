angular.module('panelApp').controller('campaignActionController', ['$routeParams', 'CampaignActions', 'CampaignAction', 'currentPath', 'toast', 'campaignMENU', 'panelCache', 'Upload', 'CampaignBeacons', 'CampaignAds', 'absUtils', 'pageLoader', function($routeParams, CampaignActions, CampaignAction, currentPath, toast, campaignMENU, panelCache, Upload, CampaignBeacons, CampaignAds, absUtils, pageLoader){
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
    this.cache = panelCache;
    this.absUtils = absUtils;
    // action params
    this.campaignID = $routeParams.campaignID;
    this.campaignNAME = $routeParams.campaignNAME;
    this.campaignM = campaignMENU;
    this.campaignM.setID(this.campaignID>0?this.campaignID:0);
    this.actionID = $routeParams.actionID;
    this.actionNAME = $routeParams.actionNAME;
    // model
    this.action = { id:0 };
    this.actionCOPY = {};
    this.perPage = 5;

    this.beaconsList = [];
    this.beaconsPages = [];	// numbers
    this.beaconsCurrentPage = 1;
    this.numberOfBeaconsItems = 0;

    this.adsList = [];
    this.adsPages = []; // numbers
    this.adsCurrentPage = 1;
    this.numberOfAdsItems = 0;

    this.dismiss = function(){
        this.action = angular.copy(this.actionCOPY);
    }
    this.save = function(){
        if (this.actionID>0){
            this.patchAction();
        } else {
            this.postAction();
        }
    }
    this.makeCopy = function(){
        this.actionCOPY = angular.copy(this.action);
        this.actionID = this.action.id;
        this.actionNAME = this.action.title;
    }

    this.updatePath = function () {
        debugger
        this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.campaignID) + " / Actions / " + this.action.id);
        this.currentPath.setPage(this.action.id);
    }
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

    this.adsNavActive = function(page){
        if (page==this.adsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.adsNavNext = function(){
        if (this.adsCurrentPage<this.adsPages.length){
            this.getads(this.adsCurrentPage+1);
        }
    };
    this.adsNavPrev = function(){
        if (this.adsCurrentPage>1){
            this.getads(this.adsCurrentPage-1);
        }
    };
    // beacon
    this.useNewBeacon = function(id){
        this.action.beacon = id;
    }
    this.removeNewBeacon = function(){
        this.action.beacon = "";
    }
    // ad
    this.useNewAd = function(id){
        this.action.ad = id;
    }
    this.removeNewAd = function(){
        this.action.ad = "";
    }
    // get action
    this.getAction = function(){
        if (this.actionID>0){
            if (this.isLock){
                return;
            } else {
                this.lock();
            }

            pageLoader.showLoader();


            CampaignAction.get({campaignID:this.campaignID, actionID:this.actionID}, function(success){
                this.action = success;
                this.makeCopy();
                this.unlock();
                this.updatePath();
                this.getBeacons(1);
                this.getAds(1);
                pageLoader.hideLoader();
            }.bind(this), function(error){
                this.toast.showApiError(error);
                this.unlock();
                pageLoader.hideLoader();
            }.bind(this));

        }  else {
            this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.campaignID) + " / Advertisements / " + "New action");
            this.currentPath.setPage("New action");
            this.getBeacons(1);
            this.getAds(1);
        }
    }

    this.getBeacons = function(page){
        CampaignBeacons.get({campaignID:this.campaignID, page:page, pagination:true}, function(success){
            this.beaconsList = [];
            this.beaconsPages = [];
            this.beaconsList = success.results;
            this.numberOfBeaconsItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfBeaconsItems/this.perPage)); i++) {
                this.beaconsPages.push(i+1);
            }
            this.beaconsCurrentPage = page;
        }.bind(this), function(error){
            this.toast.showApiError(error);
        }.bind(this));

    };


    this.getAds = function(page){
        CampaignAds.get({campaignID:this.campaignID, page:page, pagination:true}, function(success){
            this.adsList = [];
            this.adsPages = [];
            this.adsList = success.results;
            this.numberOfAdsItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfAdsItems/this.perPage)); i++) {
                this.adsPages.push(i+1);
            }
            this.adsCurrentPage = page;
        }.bind(this), function(error){
            this.toast.showApiError(error);
        }.bind(this));

    };

    // patch action
    this.patchAction = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        CampaignAction.patch({campaignID:this.campaignID, actionID:this.actionID}, this.action, function(){
            this.makeCopy();
            this.toast.showSuccess();
            this.unlock();
            this.updatePath();
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
        }.bind(this));

    }
    // post action
    this.postAction = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        CampaignActions.save({campaignID:this.campaignID}, this.action,  function(success){
            this.action = success;
            this.makeCopy();
            this.toast.showSuccess();
            this.unlock();
            this.updatePath();
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
        }.bind(this));
    }
    // upload photo
    this.uploadFiles = function(file, errFiles) {
        this.f = file;
        this.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/campaigns/'+this.campaignID+"/actions/"+this.actionID+"/image/",
                data: {image: file}
            });
            file.upload.then(function (response) {
                this.action.image = angular.copy(response.data.image);
                this.toast.showSuccess();
                // $timeout(function () {
                //     appInfo.showFail(response.data);
                // });
            }.bind(this), function (response) {
                if (response.status > 0)
                    this.toast.showApiError(response);
            }.bind(this), function (evt) {
            });
        }
    }


    this.getAction(this.actionID);
}]);