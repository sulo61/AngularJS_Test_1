angular.module('panelApp').controller('shopsController', ['currentPath', 'Shops', 'Shop', function(currentPath, Shops, Shop){
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
    // models
    this.shopsList = [];
    // nav
    this.shopsPages = [];	// numbers
    this.shopsCurrentPage = 1;
    this.numberOfItems = 0;
    this.perPage = 5;

    this.shopsNavActive = function(page){
        if (page==this.shopsCurrentPage){
            return "active"
        } else {
            return "";
        }
    };
    this.shopsNavNext = function(){
        if (this.shopsCurrentPage<this.shopsPages.length){
            this.getShops(this.shopsCurrentPage+1);
        }
    };
    this.shopsNavPrev = function(){
        if (this.shopsCurrentPage>1){
            this.getShops(this.shopsCurrentPage-1);
        }
    };
    // api
    this.getShops = function(page){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        Shops.get({page:page}, function(success){
            this.shopsList = [];
            this.shopsPages = [];
            this.shopsList = success.results;
            this.numberOfItems = success.count;
            for (var i=0; i<Math.ceil((this.numberOfItems/this.perPage)); i++) {
                this.shopsPages.push(i+1);
            }
            this.shopsCurrentPage = page;
            this.unlock();
        }.bind(this), function(error){
            this.unlock();
        }.bind(this));

    };
    this.deleteShop = function(id){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        Shop.delete({shopID:id}, function(){
            this.appInfo.showSuccess();
            this.numberOfItems = this.numberOfItems - 1;
            if ( (this.numberOfItems <= (this.shopsCurrentPage-1) * this.perPage) && this.numberOfItems>=this.perPage){
                this.shopsCurrentPage = this.shopsCurrentPage - 1;
            }
            this.unlock();
            this.getShops(this.shopsCurrentPage);
        }.bind(this), function(error){
            this.unlock();
        }.bind(this));

    }

    this.getShops(1);
    this.currentPath.setPath("Shops");
    this.currentPath.setPage("Shops");
}]);