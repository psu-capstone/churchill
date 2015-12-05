var app = angular.module("democracy-lab-app", ['ngRoute', 'ui.bootstrap']);

/**
 * Configure the routes taken on the web page here
 */
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'main-controller'
        })
        .when('/home', {
            templateUrl : 'pages/login.html',
            controller  : 'main-controller'
        })
        .when('/issue', {
            templateUrl : 'pages/issue.html',
            controller  : 'issue-controller',
            resolve:{
                "check":function(accessFac, $location){
                    if(accessFac.checkPermission()){
                        $location.path('/issue');
                    }else{
                        $location.path('/home');    //redirect user to home.
                        alert("You don't have access here");
                    }
                }
            }
        })
        .when('/explore', {
            templateUrl : 'pages/d3graph.html',
            controller  : 'explore-controller',
            directive   : 'bars',
            resolve:{
                "check":function(accessFac, $location){
                    if(accessFac.checkPermission()){
                        $location.path('/explore');
                    }else{
                        $location.path('/home');    //redirect user to home.
                        alert("You don't have access here");
                    }
                }
            }
        });
});

/**
 * Factory settings for the login, flesh this out later to talk to REST API, as it is now,
 * it can basically be hacked through the chrome browser ;)
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
 * Main login controller, display a login form and save valid credentials,
 * for now, the only valid credential for testing is admin 1234
 */
app.controller("main-controller", function($location, accessFac) {
    var self = this;
    self.image = "./images/demoLab_logo.png";
    self.title = "Login or Create Account";
    self.username = "";
    self.password = "";
    self.authorized = false;
    self.getAccess = function(){
        console.log(self.username + " " + self.password);
        if (self.username == "admin" && self.password == "1234") {
            //call the method in accessFac to allow the user permission.
            accessFac.getPermission();
            self.authorized = true;
            console.log("Login successful");
            $location.path('/issue');
        } else {
            accessFac.rejectPermission();
            self.authorized = false;
            console.log("Login unsuccessful");
        }
    }
});

/**
 * Voting for issues and setting values will be done here
 */
app.controller("issue-controller", [function() {
    var self = this;
    self.title = "Weigh in on an issue";
}]);

/**
 * Displaying the data is done on this controller
 */
app.controller("explore-controller", [function() {
    var self = this;
    self.title = "Explore the issues";
}]);

/**
 * D3 directive that is embedded in explore-controller.
 */
app.directive("bars", function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div id="chart"></div>',
        link: function (scope, element, attrs) {
            var data = attrs.data.split(','),
                chart = d3.select('#chart')
                    .append("div").attr("class", "chart")
                    .selectAll('div')
                    .data(data).enter()
                    .append("div")
                    .transition().ease("elastic")
                    .style("width", function(d) { return d + "%"; })
                    .text(function(d) { return d + "%"; });
        }
    };
});