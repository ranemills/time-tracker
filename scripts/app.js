angular.module('timeTrackerApp', ['angularMoment', 'timer', 'chart.js'])
.controller('mainCtrl', function (recordService) {

  this.$onInit = function() {
    this.definedActivities = ['Default', 'PR Review', 'Coding', 'Talking'];
    this.activity = 'PR Review';
  };

  this.setActivity = function(activity) {
    this.activity = activity;
  };

  this.recordTime = function(startTime, endTime) {
    recordService.addRecord({startTime, endTime, duration: endTime.diff(startTime), activity: this.activity});
  };

  this.getRecords = recordService.getRecords;

})
.constant('_', window._)
.service('recordService', function() {

  // Record format: { startDate, endDate, duration, activity }

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
.component('activitySelector', {
  templateUrl: 'components/activity-selector.html',
  bindings: {
    onSelect: '&',
    activities: '<',
    defaultActivity: '<'
  },
  controllerAs: 'activitySelectorCtrl',
  controller: function() {
    let activitySelectorCtrl = this;

    activitySelectorCtrl.$onInit = function() {
      this.changeActivity(this.defaultActivity);
    };

    activitySelectorCtrl.changeActivity = function(activity) {
      this.selectedActivity = activity;
      this.onSelect({activity});
    };
  }
})
.component('timePieChart', {
  templateUrl: 'components/time-pie-chart.html',
  bindings: {
    records: '<'
  },
  controllerAs: 'timePieChartCtrl',
  controller: function() {
    let timePieChartCtrl = this;

    timePieChartCtrl.$onInit = function() {
      timePieChartCtrl.labels = ['All'];
    };

    timePieChartCtrl.chartData = function() {
      if(!angular.equals(timePieChartCtrl.records, timePieChartCtrl.cachedRecords))
      {
        timePieChartCtrl.cachedRecords = _.clone(timePieChartCtrl.records);

        let data = _.transform(timePieChartCtrl.records, function(result, record) {
          result[record.activity] = _.get(result, record.activity, 0) + record.duration/1000;
        }, {});

        if(_.size(data) !== 0) {
          timePieChartCtrl.labels = _.keys(data);
          timePieChartCtrl.cachedData =  _.values(data);
        } else {
          timePieChartCtrl.labels = ['N/A'];
          timePieChartCtrl.cachedData = [0];
        }
      }
      return timePieChartCtrl.cachedData;
    }
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
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };

    timeChartCtrl.chartData = function() {
      if(!angular.equals(timeChartCtrl.records, timeChartCtrl.cachedRecords))
      {
        timeChartCtrl.cachedRecords = _.clone(timeChartCtrl.records);

        let data = _.transform(timeChartCtrl.records, function(result, record) {
          result[record.activity] = _.get(result, record.activity, 0) + record.duration/1000;
        }, {});

        if(_.size(data) !== 0) {
          timeChartCtrl.labels = _.keys(data);
          timeChartCtrl.cachedData =  _.values(data);
        } else {
          timeChartCtrl.labels = ['N/A'];
          timeChartCtrl.cachedData = [0];
        }
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