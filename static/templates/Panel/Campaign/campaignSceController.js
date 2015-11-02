angular.module('panelApp').controller('campaignSceController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// shop id
	this.id = $routeParams.id;
	// model
	
}]);