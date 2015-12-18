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
            templateUrl : 'pages/d3graph.html',
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
 * Main login controller, display a login form and save valid credentials,
 * for now, the only valid credential for testing is admin 1234
 */
app.controller("main-controller", function($http, $location, accessFac) {
    var self = this;
    self.image = "./images/demoLab_logo.png";
    self.title = "Login or Create Account";
    self.unsuccessful = "Username or Password is incorrect";
    self.username = "";
    self.password = "";
    self.authorized = false;
    self.getAccess = function(){

        // Testing API here
        var user_arg = JSON.stringify({
            username: "rta",
            name:"Ryan",
            city:"Portland"
        });

        // Send the data
        $http.post("http://localhost:9000/api/user", user_arg).success(function(data, status) {
            console.log(data);
        });

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
            self.reject = true;
            console.log("Login unsuccessful");
        }
    };
    self.createAccount = function() {

    };
});

/**
 * Voting for issues and setting values will be done here
 */
app.controller("issue-controller", [function() {
    var self = this;
    self.title = "Weigh in on an issue";
    self.var = {
        showform : false,
        new_title : "",
        new_description : ""
    };
}]);

/**
 * Directive for handling new buttons added
 * TODO 1.) support to backend and saving
 * TODO 2.) Fix refreshing issue
 * 2.) can be fixed when we tie this to the backend since we will look for issues added by
 * the community and look to the database to populate the frontend issues
 */
app.directive("issuenew", function($compile) {
    var count = 0;  //in case we want to limit the amount of issues that can be added
    var link = function (scope) {
        scope.populateissue = function () {
            if (count >= 3) {
                console.log("limit reached");
            } else {
                angular.element(document.getElementById('space-for-issues'))
                    .append($compile("<div class='issue row'><div class='issue'>" +
                        "<button class='btn btn-primary btn-block'>{{issue.new_title}}</button>" +
                        "</div><h5>{{issue.new_description}}</h5></div>")(scope));
                count++;
            }

        };
    };

    return {
        restrict: "E",
        link: link,
        template: "<button ng-click='populateissue()' type='button' class='btn btn-success'>Add New Issue</button>"
    }
});

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