angular.module('panelApp').controller('campaignAbController', ['$routeParams', 'CampaignAds', 'CampaignAd', 'currentPath', 'toast', 'campaignMENU', 'panelCache', 'Upload', 'absUtils', function($routeParams, CampaignAds, CampaignAd, currentPath, toast, campaignMENU, panelCache, Upload, absUtils){
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
    // award params
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
                this.toast.showError(error);
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
            this.toast.showError(error);
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
            this.toast.showError(error);
            this.unlock();
        }.bind(this));
    }
    // upload photo
    this.uploadFiles = function(file, errFiles) {
        this.f = file;
        this.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/campaigns/'+this.campaignID+"/ads/"+this.adID+"/image/",
                data: {image: file}
            });
            file.upload.then(function (response) {
                this.ad.image = angular.copy(response.data.image);
                this.toast.showSuccess();
                // $timeout(function () {
                //     appInfo.showFail(response.data);
                // });
            }.bind(this), function (response) {
                if (response.status > 0)
                    this.toast.showError(response.status + ': ' + response.data);
            }, function (evt) {
            });
        }
    }


    this.getAd(this.adID);
}]);