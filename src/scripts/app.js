angular.module('timeTrackerApp', ['angularMoment', 'timer', 'chart.js'])
.run(function(activityService, recordService) {
  activityService.init();
  recordService.init();
})
.controller('mainCtrl', function (recordService, activityService) {
  let mainCtrl = this;

  mainCtrl.$onInit = function() {
    mainCtrl.showEdit = false;
  };

  mainCtrl.saveTime = function() {
    recordService.addRecord(mainCtrl.recordPendingSave);
    mainCtrl.showEdit = false;
    mainCtrl.recordPendingSave = null;
  };

  mainCtrl.recordTime = function(startTime, endTime) {
    mainCtrl.showEdit = true;
    mainCtrl.recordPendingSave = {
      startTime,
      endTime,
      duration: endTime.diff(startTime),
      activity: activityService.getSelectedActivity(),
      note: ''
    }
  };

  mainCtrl.discardActivity = function() {
    mainCtrl.showEdit = false;
    mainCtrl.recordPendingSave = null;
  };

  mainCtrl.getRecords = recordService.getRecords;

})
.constant('_', window._)
.service('activityService', function(storageService) {
  const STORAGE_DEFINED_ACTIVITIES = "DEFINED_ACTIVITIES";

  let selectedActivity = '';
  let definedActivities = [];

  function init() {
    definedActivities = storageService.getValue(STORAGE_DEFINED_ACTIVITIES) || ['Default'];
  }

  function getSelectedActivity() {
    return selectedActivity;
  }

  function setSelectedActivity(activity) {
    selectedActivity = activity;
  }

  function getDefinedActivities() {
    return definedActivities;
  }

  function addDefinedActivity(activity) {
    definedActivities.push(activity);
    storageService.setValue(STORAGE_DEFINED_ACTIVITIES, definedActivities);
  }

  return {
    init,
    getSelectedActivity,
    setSelectedActivity,
    getDefinedActivities,
    addDefinedActivity
  }
})
.service('recordService', function(storageService) {
  const STORAGE_RECORDED_ACTIVITIES = "RECORDED_ACTIVITIES";

  // Record format: { startDate, endDate, duration, activity }

  let records = [];

  function init() {
    records = storageService.getValue(STORAGE_RECORDED_ACTIVITIES) || [];
  }

  function getRecords() {
    return records;
  }

  function addRecord(data) {
    records.push(data);
    storageService.setValue(STORAGE_RECORDED_ACTIVITIES, records);
  }

  return {
    init,
    getRecords,
    addRecord
  }
})
.service('storageService', function(_, $window) {

  function setValue(key, data) {
    $window.localStorage.setItem(key, JSON.stringify(data));
  }

  function getValue(key) {
    return JSON.parse($window.localStorage.getItem(key));
  }

  function clear() {
    $window.localStorage.clear();
  }

  return {
    setValue,
    getValue,
    clear
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
  bindings: {},
  controllerAs: 'activitySelectorCtrl',
  controller: function(activityService) {
    let activitySelectorCtrl = this;

    activitySelectorCtrl.$onInit = function() {
      activitySelectorCtrl.changeActivity(activitySelectorCtrl.getActivities()[0]);
      activitySelectorCtrl.newActivityName = '';
    };

    activitySelectorCtrl.getActivities = activityService.getDefinedActivities;

    activitySelectorCtrl.getButtonStyle  = function(activity) {
      return activity === activityService.getSelectedActivity() ? 'active' : '';
    };

    activitySelectorCtrl.changeActivity = function(activity) {
      activityService.setSelectedActivity(activity);
    };

    activitySelectorCtrl.addActivity = function() {
      activityService.addDefinedActivity(activitySelectorCtrl.newActivityName);
      activityService.setSelectedActivity(activitySelectorCtrl.newActivityName);
      activitySelectorCtrl.newActivityName = '';
    }
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
})
.component('editActivityComponent', {
  templateUrl: 'components/edit-activity.html',
  bindings: {
    activity: '<',
    onSave: '&',
    onCancel: '&'
  },
  controllerAs: 'editActivityCtrl',
  controller: function (activityService) {
    let editActivityCtrl = this;

    editActivityCtrl.$onInit = function() {
      editActivityCtrl.activityTypes = activityService.getDefinedActivities();
    }
  }
})
.component('settingsComponent', {
  templateUrl: 'components/settings.html',
  bindings: {},
  controllerAs: 'settingsCtrl',
  controller: function ($window, storageService) {
    let settingsCtrl = this;

    settingsCtrl.clear = function() {
      storageService.clear();
      $window.location.reload();
    }
  }
});