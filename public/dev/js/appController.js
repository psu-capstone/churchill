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
 * Displaying the data is done on this controller
 */
app.controller("explore-controller", [function() {
    var self = this;
    self.title = "Explore the issues";
}]);