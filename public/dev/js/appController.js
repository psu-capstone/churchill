/**
 * Main login controller, display a login form and save valid credentials,
 * for now, the only valid credential for testing is admin 1234
 */
app.controller("main-controller", [ '$http', '$location', '$cookies', 'accessFac', 'dataFac',
    function($http, $location, $cookies, accessFac, dataFac) {
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
                        $cookies.name = self.username;
                        console.log($cookies.name);
                        $location.path('/issue');
                    } else {
                        accessFac.rejectPermission();
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
app.controller("issue-controller", ['dataFac', function(dataFac) {
    var self = this;
    self.title = "Weigh in on an issue";
    self.voting = false;

    self.issuerows = [];

     self.getIssues = function() {
        dataFac.getAll('api/community/issue', 'i1')
            .success(function(data) {
                for(var i = 0; i < data['nodes'].length; i++) {
                    var temp = data['nodes'][i].name;
                    self.issuerows.push({name: temp, description: 'placeholder', voting: false });
                }
            })
            .error(function(data) {
                console.log(data);
            });
    };
    
    self.vote = function() {
        self.voting = true;
    };

    self.choices = [{id: 'choice1'}];

    self.addNewChoice = function() {
        var newItemNo = self.choices.length + 1;
        self.choices.push({'id':'choice'+ newItemNo});
    };

    self.removeChoice = function() {
        var lastItem = self.choices.length - 1;
        self.choices.splice(lastItem);
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
app.controller('rank-controller', ['utilsFac', 'dataFac','$scope', '$cookies', function(utilsFac, dataFac, $scope, $cookies) {
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

    self.buckets = [[[],[],[],[],[]], [[],[],[],[],[]],[[],[],[],[],[]]];
    self.title = ['Values', 'Objectives', 'Policies'];
    self.tgtData = self.buckets[0];
    self.buttonTitle = 'Submit';
    self.lik = utilsFac.likert;
    self.currentSet = 0;
    self.srcData = {};
    self.currentUser = $cookies.name;

    $scope.$watch('row.voting', function(value) {
        if(value) {
            self.showContent();
        }
    });

    self.showContent = function() {
        var which = endpoints[self.currentSet];
        if( self.srcData[which] === undefined ) {
            fetchContent(which);
        }
        self.tgtData = self.buckets[self.currentSet];
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
        }
        $('#submitButton').prop('disabled', function(i, v) { return disable; });
    };

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
app.controller("explore-controller", ['utilsFac', 'dataFac', '$q', '$cookies' , function(utilsFac, dataFac, $q, $cookies) {
    var self = this,
        tempData = null,
        endpoints = utilsFac.endpointPfx,
        fetchContent = function(which) {
            var dfrd = $q.defer();
            dataFac.getStacked('api/summary/' + which, 'i1')
                .success(function(data) {
                    dfrd.resolve(data);
                })
                .error(function(error) {
                    dfrd.reject("An error has occurred" + error);
                });
            return dfrd.promise;
        };

    self.title = "Explore the issues";
    self.currentUser = $cookies.name;
    self.lik = utilsFac.likert;
    self.srcData = {};
    self.currentSet = 1;
    self.opinions = [[-2,-1,0,1,2],[-2,-1,0,1,2],[-2,-1,0,1,2,1,2,0]];

    self.showContent = function() {
        var which = endpoints[self.currentSet];
        if( self.srcData[which] === undefined ) {
            fetchContent(which).then(function(data){
                tempData = data.data;
                self.opinion = self.opinions[self.currentSet];
                transpose();
                appendUserData();
                scatterPositioning();
                formatData();
                self.srcData[which] = tempData
                self.data = self.srcData[which];
            });
        } else {
            self.data = self.srcData[which];
        }
    };

    var transpose = function(){
        var formatted = [[],[],[],[],[]];
        
        for(var i in tempData){
            for(var j = 0; j < tempData[i].length; j++){
                formatted[j].push(tempData[i][j]);
            }
        }
        tempData = formatted;
    };
    
    var formatData = function() {
        var length = tempData.length,
            headers = ['x','Question1','Question2','Question3','Question4','Question5'];

        if(tempData[0].length == 8 ) {
            headers.push('Question6');
            headers.push('Question7');
            headers.push('Question8');
        }


        for(var i = 0; i < length - 1; ++i) {
            tempData[i].unshift(self.lik[i - 2]);
        }
        tempData[length -1].unshift('you');
        tempData.unshift(headers);
    };

    var scatterPositioning = function() {
        var buffer,
            opinionRow,
            centered,
            opinions = self.opinion,
            length = opinions.length,
            userColumn = tempData[5];

        for(var i = 0; i < length; ++i) {
             opinionRow = index(opinions[i]);
             centered = centerOpinionValue(opinionRow, i, tempData);
             buffer = sumBuffer(opinionRow - 1, i, tempData);
             userColumn[i] = centered + buffer;
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
        tempData.push(temp);
    };
}]);