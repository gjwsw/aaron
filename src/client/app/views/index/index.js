/* global angular */

'use strict';

angular.module('aaron.view.index', [
    'ngRoute'
  , 'ng'
])

.config(($routeProvider) => {
    $routeProvider.when('/', {
        controller: 'IndexController',
        templateUrl: 'app/views/index/index.tpl.html'
    });
})

.controller('IndexController', ($scope, $http, $q) => {
    $http.get('/api/v1/person').success(urls => {
        $q.all(urls.map($http.get)).then(results => {
            $scope.persons = results.map(result => result.data);
        });
    });
});