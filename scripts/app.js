angular.module('timeTrackerApp', ['angularMoment'])
.controller('timerCtrl', function($scope, $interval, moment) {

  $scope.time = moment();
  $scope.isTiming = false;

  function setTimeAgo() {
    $scope.timeAgo = moment.utc(moment().diff($scope.startTime));
  }


  $scope.start = function() {
    $scope.startTime = moment();
    $scope.isTiming = true;

    $scope.interval = $interval(setTimeAgo, 1000);
  };

  $scope.stop = function() {
    $scope.duration = moment().diff($scope.startTime);
    console.log($scope.duration);
    $interval.cancel($scope.interval);

    $scope.isTiming = false;
  }

});