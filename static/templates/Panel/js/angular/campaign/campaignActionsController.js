angular.module('panelApp').controller('campaignActionsController', ['$routeParams', 'CampaignActions', 'CampaignAction', 'currentPath', 'toast', 'campaignMENU', 'panelCache', function($routeParams, CampaignActions, CampaignAction, currentPath, toast, campaignMENU, panelCache){
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
    // campaign params
    this.id = $routeParams.id;
    this.campaignM = campaignMENU;
    this.campaignM.setID(this.id>0?this.id:0);
    // models
    this.actionsList = [];
    this.actionsPages = [];	// numbers
    this.perPage = 5;
    this.actionsCurrentPage = 1;
    this.numberOfActionsItems = 0;
    // nav
    this.actionsNavActive = function(page){
        if (page==this.actionsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.actionsNavNext = function(){
        if (this.actionsCurrentPage<this.actionsPages.length){
            this.getActions(this.actionsCurrentPage+1);
        }
    };
    this.actionsNavPrev = function(){
        if (this.actionsCurrentPage>1){
            this.getActions(this.actionsCurrentPage-1);
        }
    };
    
    this.updatePath = function () {
        this.currentPath.setPath("Campaign / " + this.cache.getCampaignName(this.id) + " / Actions");
        this.currentPath.setPage("Actions");
    }
    // api
    this.getActions = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }


        CampaignActions.get({campaignID:this.id, page:page}, function(success){
            this.actionsList = [];
            this.actionsPages = [];
            this.actionsList = success.results;
            this.numberOfActionsItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfActionsItems/this.perPage)); i++) {
                this.actionsPages.push(i+1);
            }
            this.actionsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            this.toast.showError(error);
            this.unlock();
        }.bind(this));

    };
    this.deleteAction = function(actionID){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        CampaignAction.delete({campaignID:this.id, actionID:actionID}, function(){
            this.numberOfItems = this.numberOfItems - 1;
            if ( (this.numberOfItems <= (this.actionsCurrentPage-1) * this.perPage) && this.numberOfItems>=this.perPage ){
                this.actionsCurrentPage = this.actionsCurrentPage - 1;
            }
            this.unlock();
            this.getActions(this.actionsCurrentPage);
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.unlock();
            this.toast.showError(error);
        }.bind(this));
    }

    this.getActions(1);
    this.updatePath();

}]);