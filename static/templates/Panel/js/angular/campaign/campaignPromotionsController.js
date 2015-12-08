angular.module('panelApp').controller('campaignPromotionsController', ['$routeParams', 'CampaignPromotions', 'CampaignPromotion', 'currentPath', 'toast', 'campaignMENU', 'panelCache', function($routeParams, CampaignPromotions, CampaignPromotion, currentPath, toast, campaignMENU, panelCache){
    // lock
    this.isLock = false;
    this.lock = function(){
        this.isLock = true;
    }
    this.unlock = function(){
        this.isLock = false;
    }
    // campaign params
    this.campaignID = $routeParams.id;
    this.pageName = $routeParams.pageNAME;
    this.pageTitle = this.pageName.charAt(0).toUpperCase() + this.pageName.slice(1);
    campaignMENU.setID(this.campaignID>0?this.campaignID:0);
    // models
    this.itemsList = [];
    this.itemsPages = [];
    this.itemsPerPage = 5;
    this.itemsCurrentPage = 1;
    this.numberOfItems = 0;
    // nav
    this.itemsNavActive = function(page){
        if (page==this.itemsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.itemsNavNext = function(){
        if (this.itemsCurrentPage<this.itemsPages.length){
            this.getItems(this.itemsCurrentPage+1);
        }
    };
    this.itemsNavPrev = function(){
        if (this.itemsCurrentPage>1){
            this.getItems(this.itemsCurrentPage-1);
        }
    };
    // path
    this.updatePath = function () {
        currentPath.setPath("Campaign / " + panelCache.getCampaignName(this.campaignID) + " / " +  this.pageTitle);
        currentPath.setPage(this.pageTitle);
    }
    // api
    this.apiItem = {};
    this.apiItems = {};

    this.setupApi = function(){
        switch (this.pageName){
            case "promotions":
                this.apiItem = CampaignPromotion;
                this.apiItems = CampaignPromotions;
                break;
        }
    }

    this.setupApi();

    this.getItems = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        this.apiItems.get({campaignID:this.campaignID, page:page}, function(success){
            this.itemsList = [];
            this.itemsPages = [];
            this.itemsList = success.results;
            this.numberOfItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfItems/this.itemsPerPage)); i++) {
                this.itemsPages.push(i+1);
            }
            this.itemsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            toast.showError(error);
            this.unlock();
        }.bind(this));

    };
    this.deleteItem = function(itemID){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        this.apiItem.delete({campaignID:this.campaignID, itemID:itemID}, function(){
            this.numberOfItems = this.numberOfItems - 1;
            if ( (this.numberOfItems <= (this.itemsCurrentPage-1) * this.itemsPerPage) && this.numberOfItems>=this.itemsPerPage ){
                this.itemsCurrentPage = this.itemsCurrentPage - 1;
            }
            this.unlock();
            this.getItems(this.itemsCurrentPage);
            toast.showSuccess();
        }.bind(this), function(error){
            toast.showError(error);
            this.unlock();
        }.bind(this));
    }

    this.getItems(1);
    this.updatePath();
}]);