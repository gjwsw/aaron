/* global angular */

'use strict';

angular.module('aaron.view.index', [
    'aaron.service.person'
  , 'ngRoute'
  , 'ng'
])

.config(($routeProvider) => {
    $routeProvider.when('/', {
        controller: 'IndexController',
        templateUrl: '/app/views/index/index.tpl.html'
    });
})

.controller('IndexController', ($scope, Person) => {
    $scope.persons = Person.query();
});