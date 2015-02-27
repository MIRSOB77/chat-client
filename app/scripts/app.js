'use strict';

/**
 * @ngdoc overview
 * @name chatClientApp
 * @description
 * # chatClientApp
 *
 * Main module of the application.
 */
angular
  .module('chatClientApp', [  //'ngAnimate',
  //  'ngCookies',
  //  'ngResource',
  //  'ngRoute',
  //  'ngSanitize',
  //  'ngTouch',
  //  'ngResource',
'ui.bootstrap',
    'restangular'])
  .config(function ($routeProvider, RestangularProvider ) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/private/:nickname', {
        templateUrl: 'views/chatWindow.html',
        controller: 'PrivateChatCtrl'
      })
      //.when('/', {
      //  templateUrl: 'views/cart.html',
      //  controller: 'CartCtrl'
      //})
      //.when('/shop', {
      //  templateUrl: 'views/shop.html',
      //  controller: 'ShopCtrl'
      //})
      //.when('/article/:id', {
      //  templateUrl: 'views/item.html',
      //  controller: 'ArticleCtrl'
      //})
      .otherwise({
        redirectTo: '/'
      });

    RestangularProvider.setBaseUrl("http://localhost:8180/chat")
  })
  .service('MessagingService',function($q, $timeout) {

    var service = {}, listener = $q.defer(), socket = {
      client: null,
      stomp: null
    }, messageIds = [];

    service.RECONNECT_TIMEOUT = 30000;
    service.SOCKET_URL = "http::/chat/send";
    service.CHAT_TOPIC = "/topic/receiver";
    service.CHAT_BROKER = "/chatapp/send";

    service.receive = function() {
      return listener.promise;
    };

    service.send = function(message) {
      var id = Math.floor(Math.random() * 1000000);
      socket.stomp.send(service.CHAT_BROKER, {
        priority: 9
      }, JSON.stringify({
        message: message,
        id: id
      }));
      messageIds.push(id);
    };

    var reconnect = function() {
      $timeout(function() {
        initialize();
      }, this.RECONNECT_TIMEOUT);
    };

    var getMessage = function(data) {
      var message = JSON.parse(data), out = {};
      out.message = message.message;
      out.time = new Date(message.time);
      if (_.contains(messageIds, message.id)) {
        out.self = true;
        messageIds = _.remove(messageIds, message.id);
      }
      return out;
    };

    var startListener = function() {
      socket.stomp.subscribe(service.CHAT_TOPIC, function(data) {
        listener.notify(getMessage(data.body));
      });
    };

    var initialize = function() {
      socket.client = new SockJS(service.SOCKET_URL);
      socket.stomp = Stomp.over(socket.client);
      socket.stomp.connect({}, startListener);
      socket.stomp.onclose = reconnect;
    };

    initialize();
    return service;
  });
