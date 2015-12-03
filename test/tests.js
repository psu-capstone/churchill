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
                toEqual('pages/login.html');

            expect($route.routes['/home'].controller).toBe('main-controller');
            expect($route.routes['/home'].templateUrl).
                toEqual('pages/login.html');

            expect($route.routes['/issue'].controller).toBe('issue-controller');
            expect($route.routes['/issue'].templateUrl).
                toEqual('pages/issue.html');

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

    var ctrl;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller) {
        // Create the controller
        ctrl = $controller('main-controller');
    }));
    it('Should verify title is "Login or Create Account"', function() {
        expect(ctrl.title).toEqual("Login or Create Account");
    });

    it('Verify initialized false', function() {
        expect(ctrl.authorized).toEqual(false)
    });

    it('Verify correct login', function () {
        ctrl.username = "admin";
        ctrl.password = "1234";
        ctrl.authenticate();
        expect(ctrl.authorized).toEqual(true);
    });

    it('Verify incorrect login', function () {
        ctrl.username = "test";
        ctrl.password = "9876";
        ctrl.authenticate();
        expect(ctrl.authorized).toEqual(false);
    });
});

describe('Unit: issue-controller', function() {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller) {
        // Create the controller
        ctrl = $controller('issue-controller');
    }));
    it('should verify title is "Weigh in on..."',
        function() {
            expect(ctrl.title).toEqual("Weigh in on an issue");
        });
});

describe('Unit: explore-controller', function() {
    // Load the module with MainController
    beforeEach(module('democracy-lab-app'));

    var ctrl;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller) {
        // Create the controller
        ctrl = $controller('explore-controller');
    }));
    it('should verify title is "Explore the..."',
        function() {
            expect(ctrl.title).toEqual("Explore the issues");
        });
});