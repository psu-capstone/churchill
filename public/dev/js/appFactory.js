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

app.factory('dataFac',['$http', function($http) {
    var urlBase = 'http://localhost:9000/';
    var dataFactory = {};

    dataFactory.postUser = function (user) {
        return $http.post(urlBase + 'api/user', user);

    };
    return dataFactory;
}]);