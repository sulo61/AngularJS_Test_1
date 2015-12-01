angular.module('panelApp', ['ui.bootstrap', 'ngRoute', 'uiGmapgoogle-maps', 'ngFileUpload', 'ngResource'])
    // django auth
    .config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .config(function($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    })
    .config(['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: false
        });
    }])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when("/profile", {
                templateUrl: "/dash/profile",
                controller: "panelController",
                controllerAs: 'panelCtrl'
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
    }])
    .factory('currentPath', function() {
        currentPath = function () {
            this.path = "Current path";
            this.page = "Current page";

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
    .directive("checkIfActive", function() {
        return {
            link: function(scope, el, attrs) {
                var elementPath;
                elementPath = attrs.href;
                scope.$on('$locationChangeSuccess', function(event, newURL) {
                    if (newURL.search(elementPath) !== -1) {
                        el.parent().addClass("active");
                    } else {
                        el.parent().removeClass("active");
                    }
                })
            }
        };
    })
    .controller("panelController", function($window, currentPath, Logout, User){
        this.currentPath = currentPath;
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
        }.bind(this), function(){
        });
    })
