angular.module('timeTrackerApp', ['angularMoment', 'timer', 'chart.js'])
.controller('mainCtrl', function (recordService) {

  this.$onInit = function() {

  };

  this.recordTime = function(startTime, endTime) {
    recordService.addRecord({startTime, endTime, duration: endTime.diff(startTime)});
  };

  this.getRecords = recordService.getRecords;

})
.constant('_', window._)
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
.component('charts', {
  templateUrl: 'components/charts.html',
  bindings: {
    records: '<'
  },
  controllerAs: 'chartsCtrl',
  controller: function() {

  }
})
.component('durationsChart', {
  templateUrl: 'components/durations-chart.html',
  bindings: {
    records: '<'
  },
  controllerAs: 'durationsChartCtrl',
  controller: function() {

  }
})
.component('timeChart', {
  templateUrl: 'components/time-chart.html',
  bindings: {
    records: '<'
  },
  controllerAs: 'timeChartCtrl',
  controller: function($scope, _) {
    let timeChartCtrl = this;

    timeChartCtrl.$onInit = function() {
      timeChartCtrl.labels = ['All'];
      timeChartCtrl.options = {

      };
    };

    timeChartCtrl.chartData = function() {
      if(!angular.equals(timeChartCtrl.records, timeChartCtrl.cachedRecords))
      {
        timeChartCtrl.cachedRecords = _.clone(timeChartCtrl.records);
        timeChartCtrl.cachedData = [_.reduce(timeChartCtrl.records, (sum, record) => {
          return sum + record.duration/1000
        }, 0)];
      }
      return timeChartCtrl.cachedData;
    }
  }
})
.component('recordTable', {
  templateUrl: 'components/records-table.html',
  bindings: {
    records: '<'
  },
  controllerAs: 'recordTableCtrl',
  controller: function() {
    this.getRecords = () => this.records;
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
      this.endTime = moment();
      this.isTiming = false;
      this.onStop({startTime: this.startTime, endTime: this.endTime});
    }));
  }
});