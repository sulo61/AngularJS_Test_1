angular.module('panelApp', ['ui.bootstrap', 'ngRoute', 'ngFileUpload', 'ngResource', 'toaster', 'ngAnimate', 'ngMap', 'ngStorage', 'ngImgCrop'])
    // django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(function($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            // DASH
            .when("/profile", {
                templateUrl: "/dash/profile",
                controller: "profileController",
                controllerAs: 'profileCtrl'
            })
            .when("/campaigns", {
                templateUrl: "/dash/campaigns",
                controller: "campaignsController",
                controllerAs: 'campaignsCtrl'
            })
            .when("/shops", {
                templateUrl: "/dash/shops",
                controller: "shopsController",
                controllerAs: 'shopsCtrl'
            })
            // SHOP
            .when("/shops/:id?", {
                templateUrl: "/shop",
                controller: "shopController",
                controllerAs: 'shopCtrl'
            })
            // CAMPAIGN
            .when("/campaigns/:campaignID?/basic/", {
                templateUrl: "/campaign/basic",
                controller: "campaignBasicController",
                controllerAs: 'cBasicCtrl'
            })
            .when("/campaigns/:campaignID?/beacons/", {
                templateUrl: "/campaign/beacons",
                controller: "campaignBeaconsController",
                controllerAs: 'cBeaconsCtrl'
            })
            .when("/campaigns/:campaignID?/:pageNAME?/", {
                templateUrl: function(params){
                    return '/campaign/' + params.pageNAME;
                },
                controller: "campaignItemsController",
                controllerAs: 'cItemsCtrl'
            })
            // single
            .when("/campaigns/:campaignID?/ads/:adID?", {
                templateUrl: "/campaign/ad",
                controller: "campaignAbController",
                controllerAs: 'cAbCtrl'
            })
            .when("/campaigns/:campaignID?/awards/:awardID?", {
                templateUrl: "/campaign/award",
                controller: "campaignAwardController",
                controllerAs: 'cAwardCtrl'
            })
            .when("/campaigns/:campaignID?/promotions/:promotionID?", {
                templateUrl: "/campaign/promotion",
                controller: "campaignPromotionController",
                controllerAs: 'cPromotionCtrl'
            })
            .when("/campaigns/:campaignID?/actions/:actionID?", {
                templateUrl: "/campaign/action",
                controller: "campaignActionController",
                controllerAs: 'cActionCtrl'
            })
    }])
    .factory('currentPath', function() {
        currentPath = function () {
            this.path = "";
            this.page = "";

            this.setPath = function(path){
                this.path = path;
            }
            this.getPath = function(){
                return this.path;
            }
            this.setPage = function (page) {
                this.page = page;
            }
            this.getPage = function(){
                return this.page;
            }
        }
        return new currentPath();
    })
    .factory('pageLoader', function(){
        pageLoader = function () {
            this.isLoading = false;
            this.showLoader = function (){
                this.isLoading = true;
            }
            this.hideLoader = function (){
                this.isLoading = false;
            }
        }
        return new pageLoader();
    })
    .factory('toast', function(toaster, errorDictonary){
        toast = function () {
            this.showSuccess = function () {
                toaster.pop({
                    type: 'success',
                    title: 'Success',
                    body: '',
                    showCloseButton: true,
                    timeout: 2000
                });
            }
            this.showError = function(error){
                toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: error,
                    showCloseButton: true,
                    timeout: 3000
                });
            }
            this.showApiError = function(error){
                if (error.status == 500){
                    toaster.pop({
                        type: 'error',
                        title: 'Error',
                        body: "Server error",
                        showCloseButton: true,
                        timeout: 5000
                    });
                } else {
                    errors = Object.keys(error.data).map(function(k) { return [k, ((error.data)[k])] });
                    errors.forEach(function(e) {
                        console.log(e[0]);
                        if (document.getElementById(e[0])!=null) {
                            document.getElementById(e[0]).className = document.getElementById(e[0]).className + " has-error"
                        }
                        toaster.pop({
                            type: 'error',
                            title: 'Error: '+errorDictonary.getErrorPrettyName(e[0]),
                            body: e[1].join(),
                            showCloseButton: true,
                            timeout: 5000
                        });
                    })
                }
            }
            this.removeError = function(element){
                if (document.getElementById(element)!=null) {
                    document.getElementById(element).className = document.getElementById(element).className.replace(/(?:^|\s)has-error(?!\S)/g, '');
                }
            }
        }
        return new toast();
    })
    .factory('campaignMENU', function(){
        campaignMENU = function () {
            this.id = 0;
            this.setID = function(id){
                this.id = id;
            }
        }
        return new campaignMENU();
    })
    .factory('panelCache', function($localStorage){
        panelCache = function () {
            this.setCampaignName = function(name, id){
                $localStorage.campaignName = name;
                $localStorage.campaignID = id;
            }
            this.getCampaignName = function (id) {
                if ($localStorage.campaignID == id){
                    return $localStorage.campaignName;
                } else {
                    return "unknown";
                }
            }
        }
        return new panelCache();
    })
    .directive("checkIfActive", function() {
        return {
            link: function(scope, el, attrs) {
                var elementPath;
                elementPath = attrs.href;
                scope.$on('$locationChangeSuccess', function(event, newURL) {

                    tmp = document.createElement("a");
                    tmp.href = newURL;
                    newURL = tmp.hash;

                    if (newURL.search(elementPath) !== -1) {
                        el.parent().addClass("active");
                    } else {
                        el.parent().removeClass("active");
                    }
                })
            }
        };
    })
    .directive("checkIfCampaign", function() {
        return {
            link: function(scope, el, attrs) {
                var elementPath;
                elementPath = attrs.href;

                scope.$on('$locationChangeSuccess', function(event, newURL) {

                    tmp = document.createElement("a");
                    tmp.href = newURL;
                    newURL = tmp.hash;
                    
                    if (newURL.search("campaigns") !== -1 && (newURL.search("basic") !== -1) || newURL.search("ads") !== -1 || newURL.search("actions") !== -1 || newURL.search("awards") !== -1 || newURL.search("beacons") !== -1 || newURL.search("promotions") !== -1) {
                        el.parent().removeClass("collapse");
                    } else {
                        el.parent().addClass("collapse");
                    }

                    el.parent().removeClass("active");

                    if ( (newURL.search("basic") !== -1) && elementPath.search("basic") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("ads") !== -1) && elementPath.search("ads") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("actions") !== -1) && elementPath.search("actions") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("awards") !== -1) && elementPath.search("awards") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("beacons") !== -1) && elementPath.search("beacons") !== -1){
                        el.parent().addClass("active");
                    }
                    if ( (newURL.search("promotions") !== -1) && elementPath.search("promotions") !== -1){
                        el.parent().addClass("active");
                    }

                })
            }
        };
    })
    .controller("panelController", function($window, currentPath, Logout, User, toast, campaignMENU, panelCache, pageLoader){
        this.currentPath = currentPath;
        this.pageLoader = pageLoader;
        this.toast = toast;
        this.campaignM = campaignMENU;
        this.cache = panelCache;

        this.user = {
            first_name: "",
            last_name: "",
            email: ""
        };

        this.logout = function () {
            if (this.lock){
                return;
            } else {
                this.lock = true;
            }
            Logout.post(function(){
                    this.lock = false;
                    $window.location.href = "/";
                }, function(error) {
                    this.lock = false;
                    appInfo.showFail(error);
                }
            )};

        this.getFullName = function(){
            return this.user.first_name + " " + this.user.last_name;
        }

        User.get(function(user) {
            this.user = user;
        }.bind(this), function(error){
            this.toast.showError(error)
        });
    })
