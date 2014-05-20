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
  $scope.errorMessages = [];
  $scope.days = [];

  $scope.checkErrors = function(city, state) {
    var regex = /[\!\@\#\$\%\^\&\*\(\)\+\=\d\~\`\_]/;
    var illegalChars = [];
    illegalChars = city.match(regex);
    if (!city || city.trim() === "" || (illegalChars && illegalChars.length > 0)) {
      $scope.errorMessages.push("Please enter a valid city");
    }
    illegalChars = state.match(regex);
    if (!state || state.trim().length != 2 || (illegalChars && illegalChars.length > 0)) {
      $scope.errorMessages.push("Please enter a valid state");
    }
    if ($scope.errorMessages.length > 0) {
      return true;
    } else {
      return false;
    }

  }

  $scope.getDays = function(data) {
    $scope.days = [];
    $scope.today = new Date();
    var nextDay = $scope.today;
    $scope.cityName = data.city.name;
    $scope.daysData = data.list;
    for (var i=0; i < 7; i++) {
      var dayData = $scope.daysData[i];
      
      $scope.days.push({'idx': i,
                        'theDate': nextDay,
                        'hi': dayData.temp.max,
                        'lo': dayData.temp.min,
                        'blurb': dayData.weather[0].description,
                        'clouds': dayData.clouds,
                        'humidity': dayData.humidity,
                        'pressure': dayData.pressure,
                        'speed': dayData.speed,
                        'description': dayData.weather[0].main
                      });
      nextDay = new Date(nextDay.setDate($scope.today.getDate() + i * 1));
    }
  }

  $scope.getWeather = function(city, state) {
    
    $scope.loading = true;
    $scope.error = false;
    $scope.errorMessages = [];
    
    if (!$scope.checkErrors(city, state)) {

      weatherApi.getData(city, state).success(function(response) {
        $scope.loading = false;
        $scope.result = response;
        $scope.statusCode = response.cod;
        console.log(response);
        if ($scope.statusCode !== "200") {
          $scope.error = true;
          $scope.errorMessages.push("Uh oh! Something went wrong");
        } else {
          $scope.getDays(response);
        }

      });

    } else {
      $scope.error = true;
      $scope.loading = false;
    }
  }

});
