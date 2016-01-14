/**
 * Main login controller, display a login form and save valid credentials,
 * for now, the only valid credential for testing is admin 1234
 */
app.controller("main-controller", [ '$http', '$location', 'accessFac', 'dataFac',
    function($http, $location, accessFac, dataFac) {
        var self = this;
        self.image = "./images/demoLab_logo.png";
        self.title = "Login or Create Account";
        self.unsuccessful = "Username or Password is incorrect";
        self.username = "";
        self.password = "";
        self.name = "";
        self.city = "";
        self.authorized = false;
        self.showCreateForm = false;
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
                self.reject = true;
                console.log("Login unsuccessful");
            }
        };
        self.createAccount = function() {
            self.showCreateForm = !self.showCreateForm;
        };

        self.addUser = function () {
            //Sending to API to save user data
            var user_arg = JSON.stringify({
                username: self.username,
                password: self.password,
                name:     self.name,
                city:     self.city
            });

            dataFac.postUser(user_arg)
                .success(function(data , status) {
                    console.log(data);
                })
                .error(function(error) {
                    console.log("An error has occurred" + error);
                });
        }
}]);

/**
 * Voting for issues and setting values will be done here
 */
app.controller("issue-controller", [function() {
    var self = this;
    self.title = "Weigh in on an issue";
    self.new_title = "";
    self.new_description = "";
    self.submitIssue = function() {
        // For future, this is where user can send an alert to add a new issue to the moderator or dynamically
        // For now, just clearing on submit button press
        self.new_title = "";
        self.new_description = "";
    }
}]);

/**
 * Processing the visualization data
 */
app.controller("explore-controller", [function() {
    var self = this;
    self.title = "Explore the issues";
    self.opinion = [-2,-1,0,1,2,-2];
    self.likertToString = {
        '-2':'strongly disagree',
        '-1':'disagree',
        '0':'no opinion',
        '1':'agree',
        '2':'strongly agree'
    };
    self.data = [
        ['x','Question1','Question2','Question3','Question4','Question5','Question6'],
        ['strongly disagree', 30, 200, 200, 400, 150, 250],
        ['disagree', 130, 100, 100, 200, 150, 50],
        ['no opinion', 230, 200, 200, 300, 250, 250],
        ['agree', 75, 100, 450, 0, 300, 200],
        ['strongly agree', 250, 300, 20, 85, 430, 500]
    ];

    var scatterPositioning = function() {
        var buffer,
            opinionRow,
            centered,
            data = self.data,
            length = data[0].length;

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
    };

    /* this is so you can append the user opinion on the fly after
     * the rest of the data has been fetched
     */
    var appendUserData = function() {
        var temp = ['you'];
        self.opinion.forEach(function(x){temp.push(x);});
        self.data.push(temp);
    };

    appendUserData();
    scatterPositioning();
}]);
