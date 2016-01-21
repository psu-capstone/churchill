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
        self.new_user = "";
        self.new_pass = "";
        self.name = "";
        self.city = "";
        self.authorized = false;
        self.showCreateForm = false;
        self.getAccess = function(){

            var user_arg = JSON.stringify({
                username: self.username,
                password: self.password
            });

            dataFac.authUser(user_arg)
                .success(function(data) {
                    if(data["success"] == true) {
                        accessFac.getPermission();
                        self.authorized = true;
                        $location.path('/issue');
                    } else {
                        accessFac.rejectPermission();
                        self.authorized = false;
                        self.reject = true;
                    }
                })
                .error(function(error) {
                });
        };

        self.createAccount = function() {
            self.showCreateForm = !self.showCreateForm;
        };

        self.addUser = function () {
            //Sending to API to save user data
            var user_arg = JSON.stringify({
                username: self.new_user,
                password: self.new_pass,
                name:     self.name,
                city:     self.city
            });

            dataFac.postUser(user_arg)
                .success(function(data) {
                    console.log(data);
                })
                .error(function(error) {
                    console.log("An error has occurred" + error);
                });
        };
}]);

/**
 * Voting for issues and setting values will be done here
 */
app.controller("issue-controller", ['dataFac', function() {
    var self = this;
    self.title = "Weigh in on an issue";
    self.voting = false;
    self.issuerows = [
    {
        name: "Oregon Tax System",
        description: "Let us know what you think of Oregon's taxes!",
        voting: false
    },
    {
        name: "Abortion",
        description: "Share your views about abortion and see if common ground can be found on this polarizing issue!",
        voting: false
    },
    {
        name: "Oregon K-12 Classrooms",
        description: "Help make Oregon's schools stronger!",
        voting: false
    },
    {
        name: "A New Issue",
        description: "Something else to discuss that has been added",
        voting: false
    }
    ];
    
    self.vote = function() {
        self.voting = true;
    };
    
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
 * Ranking issues
 */
app.controller('rank-controller', ['utilsFac', 'dataFac', function(utilsFac, dataFac) {
    var self = this;

    self.title = { 1 : 'values', 2 : 'objectives', 3 : 'policies'};
    /**
     * TODO: make button appear only when ready to post ranking
     */
    self.buttonTitle = 'Submit';
    self.lik = utilsFac.likert;
    self.buckets = { 1: [[],[],[],[],[]], 2:[[],[],[],[],[]], 3:[[],[],[],[],[]]}
    self.tgtData = self.buckets[1];
    self.srcData = {};

    /**
     * TODO: Load data lazily
     */
    dataFac.getAll('api/issue/value', 'i1')
        .success(function(data) {
            self.srcData['values'] =  data;
        })
        .error(function(error) {
            console.log("An error has occurred" + error);
        });

    dataFac.getAll('api/issue/objective', 'i1')
        .success(function(data) {
            self.srcData['objectives'] =  data;
        })
        .error(function(error) {
            console.log("An error has occurred" + error);
        });

    dataFac.getAll('api/issue/policy', 'i1')
        .success(function(data) {
            self.srcData['policies'] =  data;
        })
        .error(function(error) {
            console.log("An error has occurred" + error);
        });

    self.showContent = function(x) {
        self.tgtData = self.buckets[x];
    };

    self.getData = function(x) {
        return self.srcData[self.title[x]];
    };

    self.getTitle = function(x) {
        return self.title[x];
    };

    /**
     * TODO: Wire up button, also will need to flush out recording rankings and posting to the database
     */
    self.submit = function () {

    };

    self.sortableOptions = {
        connectWith: ".sort",
        scroll: false
    };
    
    self.tgtSortableOptions = {
        connectWith: ".sortSrc",
        scroll: false
    };
    
    self.srcSortableOptions = {
        connectWith: ".sortTgt",
        scroll: false
    };
}]);

/**
 * Processing the visualization data
 */
app.controller("explore-controller", ['utilsFac' ,function(utilsFac) {
    var self = this;
    self.title = "Explore the issues";
    self.opinion = [-2,-1,0,1,2,-2];
    self.lik = utilsFac.likert;
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
            self.data[i].unshift(self.lik[i - 2]);
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