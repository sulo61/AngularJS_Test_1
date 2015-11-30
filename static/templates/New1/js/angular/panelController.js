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
                controller: "panelController",
                controllerAs: 'panelCtrl'
            })
            .when("/shops", {
                templateUrl: "/dash/shops",
                controller: "panelController",
                controllerAs: 'panelCtrl'
            })
    }])
    .factory('currentPath', function() {
        currentPath = function () {
            this.path = "";

            this.setPath = function(path){
                this.path = path;
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
    .controller("panelController", function($scope, $window, $http, $location, Logout, User){
        this.user = {};

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

        User.get(function(user) {
            this.user = user.email;
        }.bind(this), function(error){
            this.email = "?"
        });
    })
