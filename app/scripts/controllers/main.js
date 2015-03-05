'use strict';

/**
 * @ngdoc function
 * @name chatClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chatClientApp
 */
angular.module('chatClientApp')
  .controller('MainCtrl',['$scope', 'RestAngular', function ($scope, RestAngular) {

    //
    $scope.nicknameToSearch = '*';
    $scope.nicknameMatchings = [];
    $scope.chatLink = "";

    $scope.activeTab = 'global';
    $scope.loginToken = nil;

    $scope.changeTab = function changeTab($tab_name){
      $scope.activeTab = $tab_name;
    }

    $scope.searchByNickname = function(){
      var singleSearch = RestAngular.all('person', $scope.searchNickname);
      var response = singleSearch.get();

      if(response.exists){
        $scope.chatLink = "#/private/" + $scope.chatPartnerNickname;
      }
    };



  }]);
