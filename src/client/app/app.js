/* global angular */

'use strict';

angular.module('aaron', [
    'aaron.view.index',
    'aaron.view.person',
    'ngRoute'
  , 'ng'
])

.config(($routeProvider, $locationProvider) => {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
})

.controller('MetaController', ($scope, $window) => {
    $scope.title = `aaron@${$window.location.hostname}`;
});