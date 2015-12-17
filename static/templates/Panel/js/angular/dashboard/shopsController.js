angular.module('panelApp').controller('shopsController', ['currentPath', 'Shops', 'Shop', 'toast', 'pageLoader', function(currentPath, Shops, Shop, toast, pageLoader){
    // lock
    this.isLock = false;
    this.lock = function(){
        this.isLock = true;
    }
    this.unlock = function(){
        this.isLock = false;
    }
    // api info
    this.toast = toast;
    this.currentPath = currentPath;
    // models
    this.shopsList = [];
    // nav
    // models
    this.shopsList = [];
    this.shopsPages = [];
    this.shopsPerPage = 5;
    this.shopsCurrentPage = 1;
    this.numberOfShops = 0;

    // pagination nav
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

        pageLoader.showLoader();

        Shops.get({page:page}, function(success){
            this.shopsList = [];
            this.shopsPages = [];
            this.shopsList = success.results;
            this.numberOfShops = success.count;
            for (var i=0; i<Math.ceil((this.numberOfShops/this.shopsPerPage)); i++) {
                this.shopsPages.push(i+1);
            }
            this.shopsCurrentPage = page;
            this.unlock();
            pageLoader.hideLoader();
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
            pageLoader.hideLoader();
        }.bind(this));

    };
    this.deleteShop = function(id){
        if (this.isLock){
            return;
        } else {
            this.lock();
        }

        Shop.delete({shopID:id}, function(){
            this.numberOfShops = this.numberOfShops - 1;
            if ( (this.numberOfShops <= (this.shopsCurrentPage-1) * this.shopsPerPage) && this.numberOfShops>=this.shopsPerPage ){
                this.shopsCurrentPage = this.shopsCurrentPage - 1;
            }
            this.unlock();
            this.getShops(this.shopsCurrentPage);
            this.toast.showSuccess();
        }.bind(this), function(error){
            this.toast.showApiError(error);
            this.unlock();
        }.bind(this));

    }

    this.getShops(1);
    this.currentPath.setPath("Shops");
    this.currentPath.setPage("Shops");
}]);