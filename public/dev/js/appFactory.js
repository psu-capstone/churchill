/**
 * Factory settings for the login, flesh this out later to talk to REST API
 */
app.factory('accessFac',function(){
    var obj = {};
    this.access = false;
    obj.getPermission = function(){    //set the permission to true
        this.access = true;
    };
    obj.rejectPermission = function() {
        this.access = false;
    };
    obj.checkPermission = function(){
        return this.access;             //returns the users permission level
    };
    return obj;
});

/**
 * dataFac provides a simple interface for all REST calls to the back end . For more detailed information
 * about the API interface, go to https://github.com/psu-capstone/dlab-api/blob/develop/INTERFACE.md
 * or check for the same file in api/ which is in the top level directory for churchill
 */
app.factory('dataFac',['$http', function($http) {
    var urlBase = 'http://localhost:9000/';
    var dataFactory = {};

    dataFactory.getNode = function(endpoint, id, user) {
        return get(urlBase + endpoint + '?id=' + id.toString(), user);
    };

    dataFactory.getAll = function(endpoint, fieldId, user) {
        return get(urlBase + endpoint + '?fieldId=' + fieldId, user);
    };

    /**
     * TODO: Add data validation before posting to the database
     */

    dataFactory.postUser = function(user) {
        return post(urlBase + 'api/user', data);
    };

    dataFactory.authUser = function(user) {
        return post(urlBase + 'api/login', user);
    };

    dataFactory.rankNode = function(endpoint, data) {
        return post(urlBase + endpoint, data);
    };

    dataFactory.mapNodes = function(endpoint, data) {
        return post(urlBase + endpoint, data);
    }


    var get = function(url, data) {
        return $http.get(url, data);
    }

    var post = function(url, data) {
        return $http.post(url + endpoint, data);
    }
}]);