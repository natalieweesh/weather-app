var app = angular.module('weatherApp', []);

app.factory('weatherApi', function($http){
  return {
    getWeather: function(url) {
      console.log('in the factory function');
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

  $scope.getData = function(city, state) {
    var cityString = encodeURIComponent(city);
    var stateString = encodeURIComponent(state);
    var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" 
              + cityString 
              + "," 
              + stateString 
              + "&cnt=7&type=like&units=imperial";
    $scope.loading = true;
    $scope.error = false;
    

    weatherApi.getWeather(url).success(function(data) {
      $scope.loading = false;
        $scope.result = data;
        $scope.statusCode = data.cod;
        console.log(data);
        if ($scope.statusCode !== "200") {
          $scope.error = true;
        } else {
          $scope.getDays(data);
        }
    });
/*

    $http.get(url)
      .success(function(data) {
        $scope.loading = false;
        $scope.result = data;
        $scope.statusCode = data.cod;
        console.log(data);
        if ($scope.statusCode !== "200") {
          $scope.error = true;
        } else {
          $scope.getDays(data);
        }
      });
*/
  }



});