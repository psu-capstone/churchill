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
    self.issuerows = issuerows; // This can be replaced by a data pull once REST is developed
    self.new_title = "";
    self.new_description = "";
    self.submitIssue = function() {
        // For future, this is where user can send an alert to add a new issue to the moderator or dynamically
        // For now, just clearing on submit button press
        self.new_title = "";
        self.new_description = "";
    }
}]);

var issuerows = [
    {
        name: "Oregon Tax System",
        description: "Let us know what you think of Oregon's taxes!",
        voting: true,
    },
    {
        name: "Abortion",
        description: "Share your views about abortion and see if common ground can be found on this polarizing issue!",
        voting: false,
    },
    {
        name: "Oregon K-12 Classrooms",
        description: "Help make Oregon's schools stronger!",
        voting: false,
    },
    {
        name: "A New Issue",
        description: "Something else to discuss that has been added",
        voting: false,
    }
    ];

app.controller('sortable-controller', function($scope) {
  $scope.items = ["One", "Two", "Three"];

  $scope.sortableOptions = {
  };
});

/**
 * Processing the visualization data
 */
app.controller("explore-controller", [function() {
    var self = this;
    self.title = "Explore the issues";
    self.likertToString = {
        '-2':'strongly disagree',
        '-1':'disagree',
        '0':'no opinion',
        '1':'agree',
        '2':'strongly agree',
    };
    self.opinion = [-2,-1,0,1,2,-2];
    self.data = [
        [30, 200, 200, 400, 150, 250],
        [130, 100, 100, 200, 150, 50],
        [230, 200, 200, 300, 250, 250],
        [75, 100, 450, 0, 300, 200],
        [250, 300, 20, 85, 430, 500]
    ];

    var formatData = function() {
        var length = self.data.length - 1,
            headers = ['x','Question1','Question2','Question3','Question4','Question5','Question6'];

        for(var i = 0; i < length; ++i) {
            self.data[i].unshift(self.likertToString[i - 2]);
        }
        self.data[length].unshift('you');
        self.data.unshift(headers);
    };

    var scatterPositioning = function() {
        var buffer,
            opinionRow,
            centered,
            data = self.data,
            opinions = self.opinion,
            length = opinions.length;

        for(var i = 0; i < length; ++i) {
             opinionRow = index(opinions[i]);
             centered = centerOpinionValue(opinionRow, i, data);
             buffer = sumBuffer(opinionRow - 1, i, data);
             data[length-1][i] = centered + buffer;
        }
    };

    var index = function(x) {
      return x + 2;
    };

    var centerOpinionValue = function(x, y, data) {
        return data[x][y] * .5;
    };

    var sumBuffer = function(x, y, data) {
        var sum = 0;
        for(;x>=0; --x) {
            sum += data[x][y]
        }
        return sum;
    };

    /* this is so you can append the user opinion on the fly after
     * the rest of the data has been fetched
     */
    var appendUserData = function() {
        var temp = [];
        self.opinion.forEach(function(x){temp.push(x);});
        self.data.push(temp);
    };

    appendUserData();
    scatterPositioning();
    formatData();
}]);
