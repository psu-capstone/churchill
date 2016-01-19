var app = angular.module("democracy-lab-app", ['ngRoute', 'ui.bootstrap', 'ui.sortable']);

/**
 * Configure the routes taken on the web page here
 */
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : './pages/login.html',
            controller  : 'main-controller'
        })
        .when('/home', {
            templateUrl : './pages/login.html',
            controller  : 'main-controller'
        })
        .when('/issue', {
            templateUrl : './pages/issue.html',
            controller  : 'issue-controller',
            directive   : 'issuenew'
            // Commented out for testing/developing
            /*resolve:{
                "check":function(accessFac, $location){
                    if(accessFac.checkPermission()){
                        $location.path('/issue');
                    }else{
                        $location.path('/home');    //redirect user to home.
                        alert("Please Login");
                    }
                }
            }*/
        })
        .when('/explore', {
            templateUrl : './pages/d3graph.html',
            controller  : 'explore-controller',
            directive   : 'bars'
            // Commented out for testing/developing
            /*resolve:{
                "check":function(accessFac, $location){
                    if(accessFac.checkPermission()){
                        $location.path('/explore');
                    }else{
                        $location.path('/home');    //redirect user to home.
                        alert("Please Login");
                    }
                }
            }*/
        });
});