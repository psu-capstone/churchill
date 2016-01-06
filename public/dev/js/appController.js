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
    self.data = [['x','Question1','Question2','Question3','Question4','Question5','Question6'],
                 ['strongly disagree', 30, 200, 200, 400, 150, 250],
                 ['disagree', 130, 100, 100, 200, 150, 50],
                 ['no opinion', 230, 200, 200, 300, 250, 250],
                 ['agree', 75, 100, 450, 0, 300, 200],
                 ['strongly agree', 250, 300, 20, 85, 430, 500],
                 ['you', -2, -1, 0, 1, 2, -2]];

    var scatterPositioning = function() {
        var buffer,
            opinionRow,
            centered,
            length = self.data[0].length,
            data = self.data;
        for(var i = 1; i < length; ++i) {
             opinionRow = indexOpinion(data[6][i]);
             centered = centerOpinionValue(opinionRow, i, data);
             buffer = sumBuffer(opinionRow-1, i, data);
             self.data[6][i] = centered + buffer;
        }
    };

    var indexOpinion = function(x) {
      return x + 3;
    };

    var centerOpinionValue = function(x, y, data) {
        return data[x][y] * .5;
    };

    var sumBuffer = function(x, y, data) {
        var sum = 0;
        for(;x>0; --x) {
            sum += data[x][y]
        }
        return sum;
    }
    scatterPositioning();
}]);