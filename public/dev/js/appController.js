/**
 * Main login controller, display a login form and save valid credentials,
 * for now, the only valid credential for testing is admin 1234
 */
app.controller("main-controller", [ '$http', '$location', '$cookies', 'accessFac', 'dataFac', 'endpointFac', 'utilsFac',
    function($http, $location, $cookies, accessFac, dataFac, endpointFac, utilsFac) {
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

            dataFac.put(endpointFac.url_auth_user(), user_arg, authCallback, utilsFac.echo);
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


            dataFac.put(endpointFac.url_post_user(), user_arg, utilsFac.echo, utilsFac.echo);
        };
}]);

/**
 * Voting for issues and setting values will be done here
 */
app.controller("issue-controller", ['dataFac', 'endpointFac', 'utilsFac', function(dataFac, endpointFac, utilsFac) {
    var self = this;
    self.title = "Weigh in on an issue";
    self.voting = false;
    self.showRank = null;
    self.val = ["test1", "test2", "test3"];
    self.obj = ["obj1", "obj2", "obj3"];
    self.pol = ["pol1", "pol2", "pol3"];
    self.issuerows = [];

     self.getIssues = function() {
         dataFac.fetch(endpointFac.url_get_issues('i1')).then(function(data){
             for(var i = 0; i < data['nodes'].length; i++) {
                 var tempName = data['nodes'][i].name;
                 var tempDesc = data['nodes'][i].desc;
                 self.issuerows.push({name: tempName, description: tempDesc, voting: false });
             }
             self.issuerows.push({name: 'issue2', description: 'placeholder', voting: false });

         });
    };
    
    self.vote = function() {
        self.voting = true;
    };

    self.choices = [
        {label: "Values"},
        {label: "Objective"},
        {label: "Policies"}
    ];

    self.addNewChoice = function() {
        var newItemNo = self.choices.length + 1;
        self.choices.push({'id':'choice'+ newItemNo});
    };

    self.removeChoice = function() {
        var lastItem = self.choices.length - 1;
        self.choices.splice(lastItem);
    };

    self.submitIssue = function() {

        var issue_arg = JSON.stringify({
            issue_name: self.new_title,
            desc: self.new_description,
            values: self.choices[0].name,
            objectives: self.choices[1].name,
            policies: self.choices[2].name
        });
        console.log(issue_arg);
        dataFac.put(endpointFac.url_post_issue(), issue_arg, utilsFac.echo, utilsFac.echo);
    };

    self.checkForRank = function() {
        dataFac.fetch(endpointFac.url_get_rank('value','i1')).then(function(data){
            self.showRank = data['nodes'].length == 0;
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
        $('#submitButton').prop('disabled', function() { return disable; });
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
            temp = self.opinions[which];
            for(var i in data){
                temp.push(data[i].rank)
            }
        },

        parseData = function(data) {

            for(var i in data){
                tempData.push(data[i].data);
            }
        },

        transpose = function(){
            var length,
                transposed = [];
                length = tempData[0].length;
            for(var idx = 0; idx < length; idx++){
                transposed.push([]);
            }

            for(var i in tempData){
                length = tempData[i].length;
                for(var j = 0; j < length; j++){
                    transposed[j].push(tempData[i][j]);
                }
            }
            tempData = transposed;
        },

        /* This function will compute the sum of each array in data and
           return the largest.
         */
        maxArraySums = function() {
            var col = tempData.length,
                rows = tempData[0].length,
                sums = [];

            for (var i = 0; i < rows; ++i) {
                sums.push(0);
                for (var j = 0; j < col; ++j) {
                    sums[i] += tempData[j][i];
                }
            }
            self.xAxisMax = Math.max.apply(null, sums);
        },

        /* this is so you can append the user opinion on the fly after
         * the rest of the data has been fetched
         */
        appendUserData = function() {
            var temp = [];
            self.opinion.forEach(function(x){temp.push(x);});
            tempData.push(temp);
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

        processData = function(which, rawData) {
            tempData = [];
            parseData(rawData.data);
            transpose();
            maxArraySums();
            appendUserData();
            scatterPositioning();
            formatData();
            self.srcData[which] = tempData;

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
    self.xAxisMax = null;

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