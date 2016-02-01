/**
 * Main login controller, display a login form and save valid credentials,
 * for now, the only valid credential for testing is admin 1234
 */
app.controller("main-controller", [ '$http', '$location', '$cookies', 'accessFac', 'dataFac', 'endpointFac',
    function($http, $location, $cookies, accessFac, dataFac, endpointFac) {
        var self = this,

            authCallback = function(response) {
                if(response["success"] == true) {
                    accessFac.getPermission();
                    $cookies.name = self.username;
                    console.log($cookies.name);
                    $location.path('/issue');
                } else {
                    accessFac.rejectPermission();
                    self.reject = true;
                }
            },

            echo = function(response) {
                console.log(response);
            };

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

            dataFac.put(endpointFac.url_auth_user(), user_arg, authCallback, echo);
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


            dataFac.put(endpointFac.url_post_user(), user_arg, echo, echo);
        };
}]);

/**
 * Voting for issues and setting values will be done here
 */
app.controller("issue-controller", ['dataFac', 'endpointFac', function(dataFac, endpointFac) {
    var self = this;
    self.title = "Weigh in on an issue";
    self.voting = false;
    self.showRank = null;

    self.issuerows = [];

     self.getIssues = function() {
         dataFac.fetch(endpointFac.url_get_issues('i1')).then(function(data){
             for(var i = 0; i < data['nodes'].length; i++) {
                 var temp = data['nodes'][i].name;
                 self.issuerows.push({name: temp, description: 'placeholder', voting: false });
             }
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

    self.checkForRank = function() {
        dataFac.fetch(endpointFac.url_get_rank('value','i1')).then(function(data){
            if(data['nodes'].length == 0){
                self.showRank = true;
            } else {
                self.showRank = false;
            }
        });
    };
}]);

/**
 * Ranking issues
 */
app.controller('rank-controller', ['endpointFac','utilsFac', 'dataFac','$scope', '$cookies',
    function(endpointFac, utilsFac, dataFac, $scope, $cookies) {

    var self = this,
        endpoints = utilsFac.endpointPfx;

    $scope.$watch('issue.showRank', function(value) {
        if(value == true) {
            self.showContent();
        }
    });

    self.buckets = [[[],[],[],[],[]], [[],[],[],[],[]],[[],[],[],[],[]]];
    self.title = ['Values', 'Objectives', 'Policies'];
    self.tgtData = self.buckets[0];
    self.buttonTitle = 'Submit';
    self.lik = utilsFac.likert;
    self.currentSet = 0;
    self.srcData = {};
    self.currentUser = $cookies.name;

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

    self.showContent = function() {
        var which = endpoints[self.currentSet];
        if(self.srcData[which] === undefined ) {
            dataFac.fetch(endpointFac.url_get_issue_items(which, 'i1')).then(function(data) {
               self.srcData[which] = data;
            });
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
            url,
            rank,
            ready,
            which,
            bucket,
            ranked,
            rankingSet,
            userId = $cookies.name,
            issueId = 'i1';

        for(i in self.buckets) {
            bucket = self.buckets[i];
            which = utilsFac.endpointPfx[i];
            url = endpointFac.url_rank_node(which);
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
                    dataFac.put(url, ready, utilsFac.echo, utilsFac.echo);
                }
            }
        }
    };
}]);

/**
 * Processing the visualization data
 */
app.controller("explore-controller", ['endpointFac', 'utilsFac', 'dataFac', '$scope',
    function(endpointFac, utilsFac, dataFac, $scope) {

    var self = this,
        tempData = null,
        endpoints = utilsFac.endpointPfx,

        parseOpinions = function(which, data) {
            var temp;
            self.opinions[which] = [];
            temp = self.opinions[which]
            for(var i in data){
                temp.push(data[i].rank)
            }
        },

        transpose = function(){
            var formatted = [[],[],[],[],[]];

            for(var i in tempData){
                for(var j = 0; j < tempData[i].length; j++){
                    formatted[j].push(tempData[i][j]);
                }
            }
            tempData = formatted;
        },

        formatData = function() {
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
        },

        scatterPositioning = function() {
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
        },

        index = function(x) {
            return x + 2;
        },

        centerOpinionValue = function(x, y, data) {
            return data[x][y] * .5;
        },

        sumBuffer = function(x, y, data) {
            var sum = 0;
            for(;x>=0; --x) {
                sum += data[x][y]
            }
            return sum;
        },

        /* this is so you can append the user opinion on the fly after
         * the rest of the data has been fetched
         */
        appendUserData = function() {
            var temp = [];
            self.opinion.forEach(function(x){temp.push(x);});
            tempData.push(temp);
        },

        processData = function(which, data) {
            tempData = data.data;
            transpose();
            appendUserData();
            scatterPositioning();
            formatData();
            self.srcData[which] = tempData
        };

    $scope.$watch('issue.showRank', function(value) {
        if(value == false) {
            self.showContent();
        }
    });

    self.title = "Explore the issues";
    self.lik = utilsFac.likert;
    self.srcData = {};
    self.currentSet = 0;
    self.opinions = {};

    self.showContent = function() {
        var which = endpoints[self.currentSet];
        if(self.opinions[which] === undefined || self.srcData[which] === undefined) {
            dataFac.fetch(endpointFac.url_get_rank(which, 'i1')).then(function(opinionData){
                parseOpinions(which, opinionData['nodes']);
                self.opinion = self.opinions[which];
                dataFac.fetch(endpointFac.url_get_stacked(which, 'i1')).then(function(chartData){
                    processData(which, chartData);
                    self.data = self.srcData[which];
                });
            });
        } else {
            self.opinion = self.opinions[which];
            self.data = self.srcData[which];
        }
    };
}]);