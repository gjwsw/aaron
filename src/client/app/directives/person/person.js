/* global angular */

'use strict';

angular.module('aaron.directive.person', [
    'aaron.service.person'
  , 'ng'
])

.directive('person', (Person) => {
    return {
        templateUrl: '/app/directives/person/person.tpl.html',
        scope: {
            which: '@'
        },
        link: ($scope) => {
            $scope.person = Person.get({id: $scope.which});
        }
    };
});