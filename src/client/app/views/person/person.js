/* global angular */

'use strict';

angular.module('aaron.view.person', [
    'aaron.directive.person'
  , 'aaron.directive.persons'
  , 'aaron.service.person'
  , 'ngRoute'
  , 'ng'
])

.config(($routeProvider) => {
    $routeProvider
        .when('/person', {
            controller: 'PersonsController',
            templateUrl: '/app/views/person/persons.tpl.html'
        })
        .when('/person/:id', {
            controller: 'PersonController',
            templateUrl: '/app/views/person/person.tpl.html'
        });
})

.controller('PersonsController', () => {})

.controller('PersonController', ($scope, $routeParams) => {
    $scope.id = $routeParams.id;
});