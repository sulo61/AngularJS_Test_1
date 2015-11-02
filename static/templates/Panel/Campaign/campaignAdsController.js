angular.module('panelApp').controller('campaignAdsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// shop id
	this.id = $routeParams.id;	
}]);