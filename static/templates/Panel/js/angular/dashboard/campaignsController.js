angular.module('panelApp').controller('campaignsController', ['currentPath', 'Campaigns', 'Campaign', 'toast', 'dateUtils', function(currentPath, Campaigns, Campaign, toast, dateUtils){
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
    this.dateUtils = dateUtils;
    // models
    this.campaignsList = [];
    // nav
    this.campaignsList = [];
    this.campaignsPages = [];	// numbers
    this.perPage = 5;
    this.campaignsCurrentPage = 1;
    this.numberOfCampaignsItems = 0;
    // nav
    this.campaignsNavActive = function(page){
        if (page==this.campaignsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.campaignsNavNext = function(){
        if (this.campaignsCurrentPage<this.campaignsPages.length){
            this.getCampaigns(this.campaignsCurrentPage+1);
        }
    };
    this.campaignsNavPrev = function(){
        if (this.campaignsCurrentPage>1){
            this.getCampaigns(this.campaignsCurrentPage-1);
        }
    };
    // api
    this.getCampaigns = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        Campaigns.get({page:page}, function(success){
            this.campaignsList = [];
            this.campaignsPages = [];
            this.campaignsList = success.results;
            this.numberOfCampaignsItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfCampaignsItems/this.perPage)); i++) {
                this.campaignsPages.push(i+1);
            }
            this.campaignsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            this.toast.showApiError(error)
            this.unlock();
        }.bind(this));

    };
    this.deleteCampaign = function(id){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        Campaign.delete({campaignID:id}, function(){
            this.numberOfItems = this.numberOfItems - 1;
            if ( (this.numberOfItems <= (this.campaignsCurrentPage-1) * this.perPage) && this.numberOfItems>=this.perPage){
                this.campaignsCurrentPage = this.campaignsCurrentPage - 1;
            }
            this.unlock();
            this.getCampaigns(this.campaignsCurrentPage);
            this.toast.showSuccess()
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
        }.bind(this));

    }

    this.getCampaigns(1);
    this.currentPath.setPath("Campaigns");
    this.currentPath.setPage("Campaigns");
}]);