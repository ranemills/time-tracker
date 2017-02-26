angular.module('timeTrackerApp', ['angularMoment', 'timer'])
.controller('mainCtrl', function (recordService) {

  this.$onInit = function() {

  };

  this.recordTime = function(startTime, endTime) {
    recordService.addRecord({startTime, endTime, duration: endTime.diff(startTime)});
    console.log("Records " + recordService.getRecords() );
  };

  this.getRecords = recordService.getRecords;


})
.service('recordService', function() {

  // Record format: { startDate, endDate, duration }

  let records = [];

  function getRecords() {
    return records;
  }

  function addRecord(data) {
    records.push(data);
  }

  return {
    getRecords,
    addRecord
  }
})
.component('timerComponent', {
  templateUrl: 'components/timer.html',
  bindings: {
    onStop: '&'
  },
  controllerAs: 'timerCtrl',
  controller: function ($scope, moment) {

    this.$onInit = function() {
      this.isTiming = false;
      this.startTime = null;
      this.endTime = null;
    };

    this.start = function () {
      $scope.$broadcast('timer-start');
      this.startTime = moment();
      this.isTiming = true;
    };

    this.stop = function () {
      $scope.$broadcast('timer-stop');
    };

    // Once we know that the timer has stopped, we can do stuff with it
    $scope.$on('timer-stopped', angular.bind(this, function (event, data) {
      console.log('Timer Stopped - data = ', data);

      this.endTime = moment();
      this.isTiming = false;
      this.onStop({startTime: this.startTime, endTime: this.endTime});
    }));
  }
});