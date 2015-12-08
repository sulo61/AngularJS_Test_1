angular.module('panelApp').controller('campaignBasicController', ['$routeParams', 'Campaign', 'Campaigns', 'currentPath', 'toast', 'campaignMENU', 'panelCache', 'dateUtils', function($routeParams, Campaign, Campaigns, currentPath, toast, campaignMENU, panelCache, dateUtils){
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
    // model
    this.basic = {id:"", name:"", start_date:"", end_date:"", is_active:false};
    this.basicCopy = {};
    this.startDate = "01/01/1900";
    this.endDate = "01/01/1900";
    this.startHour = "01:00"
    this.endHour = "01:00"
    // save
    this.save = function(){
        this.saveBasic();
    }
    // dismiss
    this.dismiss = function(){
        this.basic = angular.copy(this.basicCopy);
    }
    // copy
    this.makeCopy = function(response){
        this.basicCopy = angular.copy(this.basic);
        this.id = this.basic.id;
        this.name = this.basic.name;
    }
    this.updatePath = function () {
        this.cache.setCampaignName(this.basic.name, this.basic.id);
        this.currentPath.setPath("Campaign / " + this.basic.name + " / Basic informations");
        this.currentPath.setPage("Basic informations");
    }
    // dates
    this.getDates = function(){
        startD = new Date(this.basic.start_date);
        endD = new Date(this.basic.end_date);

        this.startDate = dateUtils.getDatePickerFromDate(startD);
        this.endDate = dateUtils.getDatePickerFromDate(endD);
        this.startHour = dateUtils.getTimePickerFromDate(startD);
        this.endHour = dateUtils.getTimePickerFromDate(endD);


    }
    this.setDates = function(){
        startD = new Date(this.startDate);
        endD = new Date(this.endDate);

        this.basic.start_date = dateUtils.getTimestampFromDateTimePicker(this.startDate, this.startHour);
        this.basic.end_date = dateUtils.getTimestampFromDateTimePicker(this.endDate, this.endHour);
    }
    // api
    this.getBasic = function(){
        if (this.id>0){
            if (this.isLock){
                return;
            } else {
                this.lock();
            }
            Campaign.get({campaignID:this.id}, function(success){
                this.basic = success;
                this.basic.beacons = [];
                this.basicCopy = angular.copy(this.basic);
                this.unlock();
                this.updatePath();
                this.getDates();
            }.bind(this), function(error){
                this.toast.showError(error);
                this.unlock();
            }.bind(this));
        } else {
            this.currentPath.setPath("Campaign / New campaign");
            this.currentPath.setPage("New campaign");
        }
    }
    this.patchBasic = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        this.setDates()
        Campaign.patch({campaignID:this.id}, this.basic, function(){
            this.makeCopy();
            this.unlock();
            this.updatePath();
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.unlock();
            this.toast.showError(error);
        }.bind(this));
    }

    this.postBasic = function(){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }
        this.setDates()
        Campaigns.save(this.basic, function(success){
            this.basic = success;
            this.makeCopy();
            this.unlock();
            this.updatePath();
            this.toast.showSuccess();
            this.campaignM.setID(this.basic.id);
        }.bind(this), function(error){
            this.unlock();
            this.toast.showError(error);
        }.bind(this))

    }

    this.saveBasic = function(){
        if (this.id>0){
            this.patchBasic();
        } else {
            this.postBasic();
        }
    }
    this.getBasic();


}]);