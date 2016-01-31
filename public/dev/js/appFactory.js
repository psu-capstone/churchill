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

app.factory('endpointFac', ['$cookies', function($cookies) {
    return {
        url_get_rank: function(which, filterId) {
            return 'api/issue/' + which + '?filter_id=' + filterId + '&user_id=' + $cookies.name;
        },
        url_get_issue_items: function(which, filterId) {
            return 'api/issue/' + which + '?filter_id=' + filterId;
        },
        url_get_stacked: function(which, issueId) {
            return 'api/summary/' + which + '?issue_id=' + issueId;
        }
    };
}]);

/**
 * dataFac provides a simple interface for all REST calls to the back end . For more detailed information
 * about the API interface, go to https://github.com/psu-capstone/dlab-api/blob/develop/INTERFACE.md
 * or check for the same file in api/ which is in the top level directory for churchill
 */
app.factory('dataFac',['$http', '$q', function($http, $q) {
    var urlBase = 'http://capdev.meyersj.com:9000/';
    var dataFactory = {};

    dataFactory.getNode = function(endpoint, id) {
        return get(urlBase + endpoint + '?id=' + id.toString());
    };

    dataFactory.getAll = function(endpoint, fieldId) {
        return get(urlBase + endpoint + '?filter_id=' + fieldId);
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

    dataFactory.fetch = function(url) {
        var dfrd = $q.defer();
        $http.get(urlBase + url)
            .success(function(data) {
                dfrd.resolve(data);
            })
            .error(function(error) {
                dfrd.reject(error);
            });
        return dfrd.promise;
    }

    var get = function(url) {
        return $http.get(url);
    };

    var post = function(url, data) {
        return $http.post(url, data);
    };

    return dataFactory;
}]);
