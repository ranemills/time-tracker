angular.module('timeTrackerApp', ['angularMoment', 'timer'])
.controller('mainCtrl', function ($scope) {

})
.component('timerComponent', {
  templateUrl: 'components/timer.html',
  controller: function ($scope) {
    $scope.isTiming = false;

    $scope.start = function () {
      $scope.$broadcast('timer-start');
      $scope.isTiming = true;
    };

    $scope.stop = function () {
      $scope.$broadcast('timer-stop');
      $scope.isTiming = false;
    };

    $scope.$on('timer-stopped', function (event, data) {
      console.log('Timer Stopped - data = ', data);
    });
  }
});