/* global angular */

'use strict';

angular.module('aaron.directive.persons', [
    'aaron.service.person'
  , 'ng'
])

.directive('persons', ($q, $http, Person) => {
    return {
        templateUrl: '/app/directives/persons/persons.tpl.html',
        link: ($scope) => {
            Person.query(urls => {
                $q.all(urls.map($http.get)).then(results => {
                    $scope.persons = results.map(result => result.data);
                });
            });
        }
    };
});