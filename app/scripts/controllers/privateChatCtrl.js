/**
 * Created by mirsad on 26.02.15.
 */
angular.module('chatClientApp')
  .controller('PrivateChatCtrl', function ($scope, $routeParams, MessagingService, RestAngular) {

    ChatService.receive().then(null, null, function(message) {
      $scope.messages.push(message);
    });

    $scope.chatPartnerNickname = $routeParams['nickname'] || "*" ;
    $scope.messages = {};
    $scope.message = "";


    $scope.addMessage = function(){
      $outgoing_msg = {};
      $outgoing_msg.sender = "johny";
      $outgoing_msg.receiver = $scope.chatPartnerNickname;
      $outgoing_msg.text = $scope.message;
      MessagingService.send($outgoing_msg);
      $scope.message = "";
    }


  });