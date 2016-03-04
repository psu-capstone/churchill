var app = angular.module("democracy-lab-app", ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ui.sortable'])
    .value('$anchorScroll', angular.noop);

/**
 * Configure the routes taken on the web page here
 * Check for a valid cookie on the home page, or redirect the user back to the login page
 * to verify credentials
 */
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : './pages/login.html',
            controller  : 'main-controller'
        })
        .when('/logout', {
            templateUrl : './pages/login.html',
            controller  : 'main-controller',
            resolve: {
                "check": function($cookies) {
                    // remove cookie when log out is selected, otherwise it stays
                    if($cookies.get('currentUser') != null) {
                        $cookies.remove('currentUser');
                    }
                }
            }
        })
        .when('/home', {
            templateUrl : './pages/login.html',
            controller  : 'main-controller'
        })
        .when('/issue', {
            templateUrl : './pages/issue.html',
            controller  : 'issue-controller',
            resolve:{
                "check":function(accessFac, $location, $cookies){
                    if($cookies.get('currentUser') != null){
                        $location.path('/issue');
                    } else {
                        //redirect user to home
                        $location.path('/home');
                    }
                }
            }
        })
        .when('/help', {
            templateUrl : './pages/help.html',
            controller  : 'help-controller',
            resolve:{
                "check":function(accessFac, $location, $cookies){
                    if($cookies.get('currentUser') != null){
                        $location.path('/help');
                    } else {
                        //redirect user to home
                        $location.path('/home');
                    }
                }
            }
        })
});