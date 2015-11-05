angular.module('panelApp').controller('actionsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
// api info
	this.appInfo = appInfo;
	// campaign params
	this.id = $routeParams.id;
	this.name = $routeParams.name;
	// model
	

}]);