/**
 * Factory settings for the login
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
 * Singleton object that makes useful stuff uniquely available
 */
app.factory('utilsFac', function(){
   return {
       likert: {
           '-2':'strongly disagree',
           '-1':'disagree',
           '0':'no opinion',
           '1':'agree',
           '2':'strongly agree'
       },
       endpointPfx: [
           'value',
           'objective',
           'policy'
       ]
   };
});

/**
 * dataFac provides a simple interface for all REST calls to the back end . For more detailed information
 * about the API interface, go to https://github.com/psu-capstone/dlab-api/blob/develop/INTERFACE.md
 * or check for the same file in api/ which is in the top level directory for churchill
 */
app.factory('dataFac',['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
    var urlBase = 'http://capdev.meyersj.com:9000/';
    var dataFactory = {};
    var getRank = function(which, filterId, userId){
        return get(urlBase + 'api/issue/' + which + '?filter_id=' + filterId + '&user_id=' + $rootScope.user);
    };

    dataFactory.getNode = function(endpoint, id) {
        return get(urlBase + endpoint + '?id=' + id.toString());
    };

    dataFactory.getAll = function(endpoint, fieldId) {
        return get(urlBase + endpoint + '?filter_id=' + fieldId);
    };



    dataFactory.getStacked = function(endpoint, issueId) {
        return get(urlBase + endpoint + '?issue_id=' + issueId);
    };
    
    dataFactory.postUser = function(data) {
        return post(urlBase + 'api/user', data);
    };

    dataFactory.authUser = function(data) {
        return post(urlBase + 'api/login', data);
    };

    dataFactory.rankNode = function(endpoint, data) {
        return post(urlBase + endpoint, data);
    };

    dataFactory.mapNodes = function(endpoint, data) {
        return post(urlBase + endpoint, data);
    };

    dataFactory.fetchRank = function(which) {
        var dfrd = $q.defer();
        getRank(which, 'i1', $rootScope.user)
            .success(function(data) {
                dfrd.resolve(data);
            })
            .error(function(error) {
                dfrd.reject("An error has occurred" + error);
            });
        return dfrd.promise;
    };

    var get = function(url) {
        return $http.get(url);
    };

    var post = function(url, data) {
        return $http.post(url, data);
    };

    return dataFactory;
}]);
