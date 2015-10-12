'use strict';

var apiKey = "AsGd3Ib2TXOfkPL3idZ24LO0vB7ksrHa";
var content = 'photo';
var url = "http://api.ap.org/v2/search/" + content + "?apikey=" + apiKey;

var imageObj = {
  title: null,
  contentxhtml: null,
  published: null,
  source: null,
  rights: null,
  updated: null
};


function httpService($http, $q, $timeout) {
  var getData = null;

  function get(){
    return $http.get(url)
        .success(function (response){
          getData = response;
        });
  }

  var promise = get();

  return {
    promise: promise,
    getData: function () {
      return getData;
    },
    updateData: function(newURL) {
      promise = get(newURL);
      var defer = $q.defer();
      $timeout(function () {
        defer.resolve(promise);
      });
      return defer.promise;
    }
  };
}

function MainCtrl($scope, $location, $anchorScroll, httpService){

  var self = this;
  self.getData = httpService.getData();

  $scope.apiKey = apiKey;
  $scope.data = [];
  $scope.data = self.getData;
  $scope.link = url;
  $scope.image = imageObj;

  self.updateEntries = function(data,link){
    if(link == 'nextpage') {
      url = data.nextpage + "&apiKey=" + apiKey;
    }else{
      url = data.previouspage + "&apiKey=" + apiKey;
    }
    httpService.updateData(url).then(function(data){$scope.data = data.data;});
  };

  self.viewImage = function(newlink, contentxhtml, title, source, rights, updated, published){
    url = newlink + "&apikey=" + apiKey;

    imageObj.contentxhtml = contentxhtml,
    imageObj.title = title;
    imageObj.source = source;
    imageObj.rights = rights;
    imageObj.updated = updated;
    imageObj.published = published;

  };

  self.scrolltoTop = function(){
    $location.hash('top');
    $anchorScroll();
  };
}

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngSanitize'
])
    .service('httpService', httpService)
    .controller('MainCtrl', MainCtrl)
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: "home/home.html",
        controller:  "MainCtrl",
        resolve: {
          getData : function(httpService) {
            return httpService.promise;
          }
        }
      }).when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'MainCtrl'
      }).otherwise({redirectTo: '/'});
    }])

