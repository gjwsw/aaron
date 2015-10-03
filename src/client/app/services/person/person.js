/* global angular */

'use strict';

angular.module('aaron.service.person', [
    'ngResource'
  , 'ng'
])

.factory('Person', ($resource) => $resource('/api/v1/person/:id'));