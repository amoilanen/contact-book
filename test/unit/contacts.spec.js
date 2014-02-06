describe('ContactsController', function() {

    var contactService = null;

    beforeEach(function() {
        module('ContactsBook');
        contactService = {
            getAll: function() {},
            storeAll: function() {}
        };
    });

    function contact(id, firstName, lastName, phone, eMail) {
        return {
            id: id,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            eMail: eMail
        };
    }

    function storedContacts(contacts) {
        spyOn(contactService, "getAll").andCallFake(function(callbacks) {
            callbacks.success(contacts);
        });
        return contacts;
    }
    
    function instantiateController(callback) {
        inject(function($rootScope, $controller) {
            var scope = $rootScope.$new();
            $controller('ContactsController', {$scope: scope, 
                ContactService: contactService
            });
            expect(contactService.getAll).toHaveBeenCalledWith(jasmine.any(Object));
            scope.$apply();
            callback && callback(scope);
        });
    }

    it('sorts all contacts in alphabetical order by lastName, firstName when\
search term is empty', function() {
        storedContacts([
            contact(0, "a", "c"),
            contact(1, "b", "c"),
            contact(2, "a", "a"),
            contact(3, "b", "b")
        ]);
        instantiateController(function($scope) {
            expect($scope.filteredContacts).toEqual([
                contact(2, "a", "a"),
                contact(3, "b", "b"),
                contact(0, "a", "c"),
                contact(1, "b", "c")
            ]);
        });
    });

    it('filters contacts by search term and keeps them sorted', function() {
        storedContacts([
            contact(0, "5", "5"),
            contact(1, "4term", "4"),
            contact(2, "1", "1"),
            contact(3, "2", "2term"),
            contact(4, "3term", "3term")
        ]);
        instantiateController(function($scope) {
            $scope.searchTerm = "term";
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(3, "2", "2term"),
                contact(4, "3term", "3term"),
                contact(1, "4term", "4")
            ]);
        });
    });

    it('updates filtered contacts when original contacts are changed', function() {
        var contacts = storedContacts([
            contact(0, "1", "1"),
            contact(1, "2", "2"),
            contact(2, "3", "3")
        ]);
        instantiateController(function($scope) {
            $scope.searchTerm = "2";
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(1, "2", "2")
            ]);

            contacts[0].firstName = "2";
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(0, "2", "1"),
                contact(1, "2", "2")
            ]);
        });
    });

    it('has empty contact selection initially', function() {
        storedContacts([
            contact(0, "1", "1")
        ]);
        instantiateController(function($scope) {
            expect($scope.filteredContacts).toEqual([
                contact(0, "1", "1")
            ]);
            expect($scope.selectedContact).toBeNull();
        });
    });

    it('allows to select a contact and clear selection', function() {
        var contacts = storedContacts([
            contact(0, "1", "1"),
            contact(1, "2", "2"),
            contact(2, "3", "3")
        ]);
        instantiateController(function($scope) {
            $scope.selectContact(contacts[1]);
            expect($scope.selectedContact).toBe(contacts[1]);

            //Selecting same contact twice
            $scope.selectContact(contacts[1]);
            expect($scope.selectedContact).toBe(contacts[1]);

            $scope.selectContact(contacts[2]);
            expect($scope.selectedContact).toBe(contacts[2]);

            $scope.clearSelection();
            expect($scope.selectedContact).toBeNull();
        });
    });

    it('allows to remove not selected contact from filtered results', function() {
        var contacts = storedContacts([
            contact(0, "1", "1"),
            contact(1, "2", "2"),
            contact(2, "3", "3")
        ]);
        instantiateController(function($scope) {
            $scope.selectContact(contacts[0]);
            $scope.removeContact(contacts[1]);
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(0, "1", "1"),
                contact(2, "3", "3")
            ]);
            expect($scope.selectedContact).toBe(contacts[0]);
        });
    });

    it('allows to remove selected contact from filtered results', function() {
        var contacts = storedContacts([
            contact(0, "1", "1"),
            contact(1, "2", "2"),
            contact(2, "3", "3")
        ]);
        instantiateController(function($scope) {
            $scope.selectContact(contacts[0]);
            $scope.removeContact(contacts[0]);
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(1, "2", "2"),
                contact(2, "3", "3")
            ]);
            expect($scope.selectedContact).toBeNull();
        });
    });

    it('allows to remove contacts when search term is not empty', function() {
        var contacts = storedContacts([
            contact(0, "1", "1"),
            contact(1, "2", "2"),
            contact(2, "2", "2"),
            contact(3, "2", "2"),
            contact(3, "3", "3")
        ]);
        instantiateController(function($scope) {
            $scope.searchTerm = "2";
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(1, "2", "2"),
                contact(2, "2", "2"),
                contact(3, "2", "2")
            ]);

            $scope.removeContact(contacts[2]);
            $scope.removeContact(contacts[3]);
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(1, "2", "2"),
                contact(3, "2", "2")
            ]);
        });
    });

    it('reflects added contact in the filtered contacts', function() {
        storedContacts([
            contact(0, "1", "1"),
            contact(1, "2", "2"),
            contact(2, "3", "3")
        ]);
        instantiateController(function($scope) {
            $scope.addContact();
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(0, "1", "1"),
                contact(1, "2", "2"),
                contact(2, "3", "3"),
                contact(3, "First name", "Last name", "", "")
            ]);
        });
    });

    it('allows to add contacts to an empty list', function() {
        storedContacts([]);
        instantiateController(function($scope) {
            $scope.addContact();
            $scope.addContact();
            $scope.addContact();
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(1, "First name", "Last name", "", ""),
                contact(2, "First name", "Last name", "", ""),
                contact(3, "First name", "Last name", "", "")
            ]);
        });
    });

    it('updates the list position of a contact as its fields change', function() {
        var contacts = storedContacts([
            contact(0, "1", "1"),
            contact(1, "2", "2"),
            contact(2, "3", "3")
        ]);
        instantiateController(function($scope) {
            expect($scope.filteredContacts).toEqual([
                contact(0, "1", "1"),
                contact(1, "2", "2"),
                contact(2, "3", "3")
            ]);

            contacts[1].lastName = "4";
            $scope.$apply();

            expect($scope.filteredContacts).toEqual([
                contact(0, "1", "1"),
                contact(2, "3", "3"),
                contact(1, "2", "4")
            ]);
        });
    });

    it('can store contacts in storage', function() {
        var contacts = storedContacts([
            contact(0, "1", "1"),
            contact(1, "2", "2"),
            contact(2, "3", "3")
        ]);

        //Excessive fields should be ignored when storing contacts
        contacts[0]._fieldToIgnoreWhenStoring = "_value";

        spyOn(contactService, "storeAll");

        instantiateController(function($scope) {
            $scope.storeContacts();
            expect(contactService.storeAll).toHaveBeenCalledWith([
                contact(0, "1", "1"),
                contact(1, "2", "2"),
                contact(2, "3", "3")
            ]);
        });
    });
});