/* global angular */

'use strict';

angular.module('aaron.view.person', [
    'aaron.service.person'
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

.controller('PersonsController', ($scope, $http, $q, Person) => {
    Person.query(urls => {
        $q.all(urls.map($http.get)).then(results => {
            $scope.persons = results.map(result => result.data)
        });
    });
})

.controller('PersonController', ($scope, $routeParams, Person) => {
    $scope.person = Person.get({id: $routeParams.id});
});