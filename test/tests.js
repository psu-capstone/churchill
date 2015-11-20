/**
 *
 * Created by ryan on 11/16/15.
 */

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