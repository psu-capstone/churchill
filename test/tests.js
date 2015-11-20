/**
 * Karma tests
 *
 * Created by ryan on 11/16/15.
 */

describe('Unit: Routing', function () {
    it('should map routes to controllers', function() {
        module('democracy-lab-app');

        inject(function($route) {

            expect($route.routes['/'].controller).toBe('main-controller');
            expect($route.routes['/'].templateUrl).
                toEqual('pages/default.html');

            expect($route.routes['/home'].controller).toBe('main-controller');
            expect($route.routes['/home'].templateUrl).
                toEqual('pages/default.html');

            expect($route.routes['/login'].controller).toBe('login-controller');
            expect($route.routes['/login'].templateUrl).
                toEqual('pages/login.html');

            expect($route.routes['/explore'].controller).toBe('explore-controller');
            expect($route.routes['/explore'].templateUrl).
                toEqual('pages/d3graph.html');
            expect($route.routes['/explore'].directive).toBe('bars');
        });
    });
});

describe('Unit: main-controller', function() {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('main-controller', {
            $scope: scope
        });
    }));
    it('should verify title is "Home"',
        function() {
            expect(scope.title).toEqual("Home");
    });
});

describe('Unit: login-controller', function() {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('login-controller', {
            $scope: scope
        });
    }));

    it('Should verify title is "Login or Create Account"', function() {
        expect(scope.title).toEqual("Login or Create Account");
        });

    it('Verify initialized false', function() {
        expect(scope.authorized).toEqual(false)
        });

    it('Verify correct login', function () {
        scope.username = "admin";
        scope.authenticate();
        expect(scope.authorized).toEqual(true);
        });
});

describe('Unit: issue-controller', function($scope) {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('issue-controller', {
            $scope: scope
        });
    }));
    it('should verify title is "Weigh in on..."',
        function() {
            expect(scope.title).toEqual("Weigh in on an issue");
        });
});

describe('Unit: explore-controller', function($scope) {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('explore-controller', {
            $scope: scope
        });
    }));
    it('should verify title is "Explore the..."',
        function() {
            expect(scope.title).toEqual("Explore the issues");
        });
});