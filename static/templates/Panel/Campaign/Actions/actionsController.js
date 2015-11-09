angular.module('panelApp').controller('actionsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
// api info
	this.appInfo = appInfo;
	// campaign params
	this.id = $routeParams.id;
	// model
	this.model = 
	{
	  "beacon": "",
	  "ad": {
	    "id": 0,
	    "title": "",
	    "description": "",
	    "image": "",
	    "type": "choice"
	  },
	  "points": 0
	}

	this.lol = function(){
		$http({
			method: 'POST',
			url: '/api/campaigns/'+this.campaignID+'/actions/',
			data: this.model
		}).then(function successCallback(response){			
			appInfo.showSuccess();			
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		}.bind(this));
	}
	

}]);