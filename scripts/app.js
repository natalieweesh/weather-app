angular.module('weatherApp', [])

.factory('weatherApi', function($http){
  return {
    getData: function(city, state) {
      var cityString = encodeURIComponent(city);
      var stateString = encodeURIComponent(state);
      var url = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=7&type=like&units=imperial&q=" 
                + cityString + "," + stateString;
    
      return $http.get(url);
    }
  }
})

.controller('weatherCtrl', function($http, $scope, weatherApi) {
  
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
                        'blurb': dayData.weather[0].description,
                        'clouds': dayData.clouds,
                        'humidity': dayData.humidity,
                        'pressure': dayData.pressure,
                        'speed': dayData.speed
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
