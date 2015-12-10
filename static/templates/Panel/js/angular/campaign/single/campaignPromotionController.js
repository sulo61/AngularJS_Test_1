angular.module('panelApp').controller('campaignPromotionController', ['$routeParams', 'CampaignPromotions', 'CampaignPromotion', 'currentPath', 'toast', 'campaignMENU', 'panelCache', 'Upload', function($routeParams, CampaignPromotions, CampaignPromotion, currentPath, toast, campaignMENU, panelCache, Upload){
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
    // promotion params
    this.campaignID = $routeParams.campaignID;
    this.campaignNAME = $routeParams.campaignNAME;
    this.campaignM = campaignMENU;
    this.campaignM.setID(this.campaignID>0?this.campaignID:0);
    this.itemID = $routeParams.promotionID;
    this.promotionNAME = $routeParams.promotionNAME;
    // model
    this.promotion = { id:0 };
    this.promotionCOPY = {};

    this.dismiss = function(){
        this.promotion = angular.copy(this.promotionCOPY);
    }
    this.save = function(){
        if (this.itemID>0){
            this.patchPromotion();
        } else {
            this.postPromotion();
        }
    }
    this.makeCopy = function(){
        this.promotionCOPY = angular.copy(this.promotion);
        this.itemID = this.promotion.id;
        this.promotionNAME = this.promotion.title;
    }

    this.updatePath = function () {
        this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.campaignID) + " / Promotions / " + this.promotion.title);
        this.currentPath.setPage(this.promotion.title);
    }
    // get promotion
    this.getPromotion = function(){
        if (this.itemID>0){
            if (this.isLock){
                return;
            } else {
                this.lock();
            }
            CampaignPromotion.get({campaignID:this.campaignID, itemID:this.itemID}, function(success){
                this.promotion = success;
                this.makeCopy();
                this.unlock();
                this.updatePath();
            }.bind(this), function(error){
                this.toast.showError(error);
                this.unlock();
            }.bind(this));

        }  else {
            this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.campaignID) + " / Promotions / " + "New promotion");
            this.currentPath.setPage("New promotion");
        }
    }
    // patch promotion
    this.patchPromotion = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        CampaignPromotion.patch({campaignID:this.campaignID, itemID:this.itemID}, this.promotion, function(){
            this.makeCopy();
            this.toast.showSuccess();
            this.unlock();
            this.updatePath();
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
        }.bind(this));

    }
    // post promotion
    this.postPromotion = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        CampaignPromotions.save({campaignID:this.campaignID}, this.promotion,  function(success){
            this.promotion = success;
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
                url: '/api/campaigns/'+this.campaignID+"/promotions/"+this.itemID+"/image/",
                data: {image: file}
            });
            file.upload.then(function (response) {
                this.promotion.image = angular.copy(response.data.image);
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


    this.getPromotion(this.itemID);
}]);