var app = angular.module('weatherApp', []);

app.factory('weatherApi', function($http){
  return {
    getData: function(city, state) {
      var cityString = encodeURIComponent(city);
      var stateString = encodeURIComponent(state);
      var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" 
                + cityString + "," + stateString 
                + "&cnt=7&type=like&units=imperial";
    
    
      return $http.get(url);
    }
  }
});

app.controller('weatherCtrl', function($http, $scope, weatherApi) {
  
  $scope.loading = false;
  $scope.error = false;

  $scope.getDays = function(data) {
    $scope.today = new Date();
    var nextDay = $scope.today;
    $scope.days = [];
    $scope.cityName = data.city.name;
    $scope.daysData = data.list;
    for (var i=0; i < 7; i++) {
      var dayData = $scope.daysData[i];
      
      $scope.days.push({'theDate': nextDay,
                        'hi': dayData.temp.max,
                        'lo': dayData.temp.min,
                        'blurb': dayData.weather[0].description
                      });
      nextDay = new Date(nextDay.setDate($scope.today.getDate() + i * 1));
    }
    
  }

  

  $scope.getWeather = function(city, state) {
    
    $scope.loading = true;
    $scope.error = false;

    weatherApi.getData(city, state).success(function(response) {
      $scope.loading = false;
      $scope.result = response;
      $scope.statusCode = response.cod;
      console.log(response);
      if ($scope.statusCode !== "200") {
        $scope.error = true;
      } else {
        $scope.getDays(response);
      }

    });

  }



});