/**
 * Factory settings for the login
 */
app.factory('accessFac', function(){
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
       ],
       echo: function(noise) {
           console.log(noise);
       }
   };
});

app.factory('endpointFac', ['$cookies', function($cookies) {
    var urlBase = 'http://capdev.meyersj.com:9000/';
    return {
        url_get_issues: function(filterId) {
            return urlBase + 'api/community/issue' + '?filter_id=' + filterId;
        },
        url_get_issue_items: function(which, filterId) {
            return urlBase + 'api/issue/' + which + '?filter_id=' + filterId;
        },
        url_get_rank: function(which, filterId) {
            return urlBase + 'api/issue/' + which + '?filter_id=' + filterId + '&user_id=' + $cookies.get('currentUser');
        },
        url_get_stacked: function(which, issueId) {
            return urlBase + 'api/summary/' + which + '?issue_id=' + issueId;
        },
        url_get_node: function(which, id){
            return urlBase + 'api/' + which + '?id=' + id.toString();
        },
        url_post_user: function() {
            return urlBase + 'api/user';
        },
        url_auth_user: function() {
            return urlBase + 'api/login';
        },
        url_rank_node: function(which) {
            return urlBase + 'api/rank/' + which;
        }
    };
}]);

/**
 * dataFac provides a simple interface for all REST calls to the back end . For more detailed information
 * about the API interface, go to https://github.com/psu-capstone/dlab-api/blob/develop/INTERFACE.md
 * or check for the same file in api/ which is in the top level directory for churchill
 */
app.factory('dataFac',['$http', '$q', function($http, $q) {
    var dataFactory = {};

        dataFactory.multiPut = function(url, model) {
            var promises = []
            model.forEach(function(data) {
                promises.push(dataFactory.put(url, data));
            });
            return $q.all(promises);
        };

        dataFactory.put = function(url, data) {
            var dfrd = $q.defer();
            $http.post(url, data)
                .success(function(response) {
                    dfrd.resolve(response);
                })
                .error(function(error) {
                    dfrd.reject(error);
                });
            return dfrd.promise;
        };

        dataFactory.fetch = function(url) {
            var dfrd = $q.defer();
            $http.get(url)
                .success(function(data) {
                    dfrd.resolve(data);
                })
                .error(function(error) {
                    dfrd.reject(error);
                });
            return dfrd.promise;
        };

    return dataFactory;
}]);