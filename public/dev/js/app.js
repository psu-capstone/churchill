var app = angular.module("democracy-lab-app", ['ngRoute', 'ngCookies', 'ui.bootstrap', 'ui.sortable']);

/**
 * Configure the routes taken on the web page here
 */
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : './pages/login.html',
            controller  : 'main-controller',
            //resolve: {
            //    "check":function(accessFac, $location, $cookies) {
            //        if($cookies.get('currentUser') != null) {
            //            console.log($cookies.get('currentUser'));
            //        }
            //    }
            //}
        })
        .when('/logout', {
            templateUrl : './pages/login.html',
            controller  : 'main-controller',
            //resolve: {
            //    "check": function($cookies) {
            //        if($cookies.get('currentUser') != null) {
            //            $cookies.remove('currentUser');
            //            console.log($cookies.get('currentUser'));
            //        }
            //    }
            //}
        })
        .when('/home', {
            templateUrl : './pages/login.html',
            controller  : 'main-controller',
            //resolve: {
            //    "check":function(accessFac, $location, $cookies) {
            //        if($cookies.get('currentUser') != null) {
            //            console.log($cookies.get('currentUser'));
            //        }
            //    }
            //}
        })
        .when('/issue', {
            templateUrl : './pages/issue.html',
            controller  : 'issue-controller',
            //resolve:{
            //    "check":function(accessFac, $location, $cookies){
            //        if($cookies.get('currentUser') != null){
            //            $location.path('/issue');
            //        } else {
            //            $location.path('/home');    //redirect user to home.
            //        }
            //    }
            //}
        });
});