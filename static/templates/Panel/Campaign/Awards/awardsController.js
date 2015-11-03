angular.module('panelApp').controller('awardsController', ['$scope', '$http', '$routeParams', 'appInfo', function($scope, $http, $routeParams, appInfo){
	// api info
	this.appInfo = appInfo;
	// campaign params
	this.id = $routeParams.id;
	this.name = $routeParams.name;
	// models
	this.awardsList = [];
	this.awardsPages = [];	// numbers
	this.awardsCurrentPage = 1;
	// nav
	this.awardsNavActive = function(page){
		if (page==this.awardsCurrentPage){
			return "active"
		} else {
			return "";
		}
	};
	this.awardsNavNext = function(){
		if (this.awardsCurrentPage<this.awardsPages.length){
			this.getAwards(this.awardsCurrentPage+1);
		}
	};
	this.awardsNavPrev = function(){
		if (this.awardsCurrentPage>1){
			this.getAwards(this.awardsCurrentPage-1);	
		}
	};
	// api
	this.getAwards = function(page){
		$http({
			method: 'GET',
			url: '/campaigns/'+this.id+'/awards',
			params: {"page" : page}
		}).then(function successCallback(response){
			this.awardsList = [];
			this.awardsPages = [];
			this.awardsList = response.data.results;
			for (var i=0; i<Math.ceil((response.data.count/5)); i++) {
		    	this.awardsPages.push(i+1);
		    }
		    this.awardsCurrentPage = page;
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	};
	this.deleteAward = function(awardID, index){
		$http({
			method: 'DELETE',
			url: '/campaigns/'+this.id+'/awards/'+awardID
		}).then(function successCallback(response){
			appInfo.showSuccess();
			this.getAwards(this.awardsCurrentPage);
		}.bind(this), function errorCallback(response){
			appInfo.showFail(response);
		});	
	}

	this.getAwards(1);

}]);