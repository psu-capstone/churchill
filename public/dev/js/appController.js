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
app.controller('rank-controller', ['utilsFac', 'dataFac','$scope', function(utilsFac, dataFac, $scope) {
    var self = this,
        endpoints = utilsFac.endpointPfx,
        fetchContent = function(which) {
            dataFac.getAll('api/issue/' + which, 'i1')
                .success(function(data) {
                    self.srcData[which] = data;
                })
                .error(function(error) {
                    console.log("An error has occurred" + error);
                });
        };

    self.buckets = { 1: [[],[],[],[],[]], 2:[[],[],[],[],[]], 3:[[],[],[],[],[]]};
    self.title = { 1: 'Values', 2 : 'Objectives', 3 : 'Policies'};
    self.tgtData = self.buckets[1];
    self.buttonTitle = 'Submit';
    self.lik = utilsFac.likert;
    self.srcData = {};

    $scope.$watch('show', function(value) {
        if(value) {
            self.showContent(1);
        }
    });

    self.showContent = function(x) {
        var which = endpoints[x];
        if( self.srcData[which] === undefined ) {
            fetchContent(which);
        }
        self.tgtData = self.buckets[x];
    };

    self.getData = function(x) {
        return self.srcData[endpoints[x]];
    };

    self.getTitle = function(x) {
        return self.title[x];
    };

    self.showSubmitButton = function() {
        var source_bucket,
            disable = false;
        for(var which in endpoints) {
            source_bucket = self.srcData[endpoints[which]];
            if(source_bucket !== undefined) {
                if(source_bucket['nodes'].length != 0) {
                    disable = true;
                }
            } else {
                disable = true;
            }
        };
        $('#submitButton').prop('disabled', function(i, v) { return disable; });
    };

    /**
     * TODO: Wire up button, also will need to flush out recording rankings and posting to the database
     */
    self.submit = function () {
        var i, j,
            rank,
            ready,
            bucket,
            ranked,
            rankingSet,
            userId = 'u1',
            issueId = 'i1';

        for(i in self.buckets) {
            bucket = self.buckets[i];
            for (j in bucket) {
                rankingSet = bucket[j];
                rank = (j - 2);
                for (; 0 < rankingSet.length;) {
                    ranked = rankingSet.pop();
                    ready = JSON.stringify({
                        user_id: userId,
                        node_id: ranked.node_id,
                        issue_id: issueId,
                        rank: rank
                    });
                    dataFac.rankNode('api/rank/' + utilsFac.endpointPfx[i], ready)
                        .success(function (data) {
                            console.log(data);
                        })
                        .error(function (error) {
                            console.log("An error has occurred" + error);
                        });
                }
            }
        }
    };

    self.sortableOptions = {
        connectWith: ".sort",
        scroll: false,
        stop: function() {self.showSubmitButton()}
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