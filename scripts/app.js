angular.module('timeTrackerApp', ['angularMoment', 'timer'])
.controller('mainCtrl', function ($scope) {

})
.component('timerComponent', {
  templateUrl: 'components/timer.html',
  bindings: {
    onStop: '&'
  },
  controllerAs: 'timerCtrl',
  controller: function ($scope) {

    this.$onInit = function() {
      this.isTiming = false;
    };

    this.start = function () {
      $scope.$broadcast('timer-start');
      this.isTiming = true;
    };

    this.stop = function () {
      $scope.$broadcast('timer-stop');
      this.isTiming = false;
    };

    $scope.$on('timer-stopped', function (event, data) {
      console.log('Timer Stopped - data = ', data);
    });
  }
});