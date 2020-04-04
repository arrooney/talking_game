var app = angular.module("app", ['btford.socket-io']);

app.controller('myGame', ['$scope', 'socketFactory', function($scope, socketFactory) {
  $scope.greeting = "Asdfasdf";
  var socket = socketFactory();
  socket.emit("test", "my data");
}]);