angular.module('panelApp').controller('campaignAbController', ['$routeParams', 'CampaignAds', 'CampaignAd', 'currentPath', 'toast', 'campaignMENU', 'panelCache', 'Upload', 'absUtils', 'dataImageUtils', function($routeParams, CampaignAds, CampaignAd, currentPath, toast, campaignMENU, panelCache, Upload, absUtils, dataImageUtils){
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
    this.photoUtils = dataImageUtils;
    // ad params
    this.campaignID = $routeParams.campaignID;
    this.campaignNAME = $routeParams.campaignNAME;
    this.campaignM = campaignMENU;
    this.campaignM.setID(this.campaignID>0?this.campaignID:0);
    this.adID = $routeParams.adID;
    this.adNAME = $routeParams.adNAME;
    // model
    this.ad = { id:0 };
    this.adCOPY = {};
    this.currentTypeName = this.absUtils.getTypeNameFromNumber(-1);
    // cropper
    this.myCroppedImage='';

    this.dismiss = function(){
        this.ad = angular.copy(this.adCOPY);
    }
    this.save = function(){
        this.ad.type = this.absUtils.getTypeNumberFromName(this.currentTypeName);
        if (this.adID>0){
            this.patchAd();
        } else {
            this.postAd();
        }
    }
    this.makeCopy = function(){
        this.adCOPY = angular.copy(this.ad);
        this.adID = this.ad.id;
        this.adNAME = this.ad.title;
    }

    this.updatePath = function () {
        this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.campaignID) + " / Advertisements / " + this.ad.title);
        this.currentPath.setPage(this.ad.title);
    }
    // get ad
    this.getAd = function(){
        if (this.adID>0){
            if (this.isLock){
                return;
            } else {
                this.lock();
            }
            CampaignAd.get({campaignID:this.campaignID, adID:this.adID}, function(success){
                this.ad = success;
                this.currentTypeName = this.absUtils.getTypeNameFromNumber(this.ad.type);
                this.makeCopy();
                this.unlock();
                this.updatePath();
            }.bind(this), function(error){
                this.toast.showApiError(error);
                this.unlock();
            }.bind(this));

        } else {
            this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.campaignID) + " / Advertisements / " + "New advertisement");
            this.currentPath.setPage("New advertisement");
        }
    }
    // patch ad
    this.patchAd = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        CampaignAd.patch({campaignID:this.campaignID, adID:this.adID}, this.ad, function(){
            this.makeCopy();
            this.toast.showSuccess();
            this.unlock();
            this.updatePath();
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
        }.bind(this));

    }
    // post ad
    this.postAd = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        CampaignAds.save({campaignID:this.campaignID}, this.ad,  function(success){
            this.ad = success;
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
    // upload photo
    this.uploadFiles = function(file) {
        this.f = file;
        if (this.f) {
            this.f.upload = Upload.upload({
                url: '/api/campaigns/'+this.campaignID+"/ads/"+this.adID+"/image/",
                data: {image: this.f}
            });
            this.f.upload.then(function (response) {
                this.toast.showSuccess();
                this.ad.image = "";
                this.ad.image = angular.copy(response.data.image);
            }.bind(this), function (response) {
                if (response.status > 0)
                    this.toast.showApiError(response);
            }.bind(this), function (evt) {
            });
        }
    }

    this.saveFile = function () {
        this.f = this.photoUtils.convertDataToFile(this.myCroppedImage, "image");
        if (this.f) {
            Upload.upload({
                url: '/api/campaigns/'+this.campaignID+"/ads/"+this.adID+"/image/",
                data: {image: this.f}
            }).then(function (response){
                this.toast.showSuccess();
                this.ad.image = "";
                this.ad.image = angular.copy(response.data.image);
            }.bind(this), function(response){
                if (response.status > 0)
                    this.toast.showApiError(response);
            })
        }
    }


    this.getAd(this.adID);
}]);