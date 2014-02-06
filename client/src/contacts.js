var app = app || angular.module('ContactsBook', []);

app.controller('ContactsController', ['$scope', 'ContactService', function($scope, ContactService) {

    function fullName(contact) {
        return contact.lastName + contact.firstName;
    }

    function filterContacts(contacts, searchTerm) {
        contacts = contacts.sort(function(x, y) {
            x = fullName(x);
            y = fullName(y);

            return (x > y) ? 1 : (x < y ? -1 : 0);
        });

        if (searchTerm.length === 0) {
            return contacts;
        }

        searchTerm = searchTerm.toLowerCase();
        return contacts.filter(function(contact) {
            return fullName(contact).toLowerCase().indexOf(searchTerm) >= 0;
        });
    }

    $scope.contacts = [];
    $scope.searchTerm = "";
    $scope.selectedContact = null;
    $scope.filteredContacts = [];

    $scope.clearSelection = function() {
        $scope.selectedContact = null;
    };

    $scope.selectContact = function(contact) {
        $scope.selectedContact = contact;
    };

    $scope.storeContacts = function() {

        //Filtering out the extra fields that may be added by AngularJS
        var contactsToStore = $scope.contacts.map(function(contact) {
            return {
                id: contact.id,
                firstName: contact.firstName,
                lastName: contact.lastName,
                phone: contact.phone,
                eMail: contact.eMail
            };
        });

        ContactService.storeAll(contactsToStore);
    };

    $scope.addContact = function() {
        var contactIds = $scope.contacts.map(function(contact) {
                return contact.id;
        });
        var newContactId = Math.max(Math.max.apply(Math, contactIds), 0) + 1;
        var newContact = {
            id: newContactId,
            firstName: "First name",
            lastName: "Last name",
            phone: "",
            eMail: ""
        };

        $scope.selectedContact = newContact;
        $scope.contacts.push(newContact);
    };

    $scope.removeContact = function(contact) {
        if ($scope.selectedContact === contact) {
            $scope.selectedContact = null;
        }
        var indexOfContact = $scope.contacts.indexOf(contact);

        if (indexOfContact >= 0) {
            $scope.contacts.splice(indexOfContact, 1);
        }
    };

    //If we edit the first or last names the position in the filtered list should change
    $scope.$watch("contacts", function() {
        $scope.filteredContacts = filterContacts($scope.contacts, $scope.searchTerm);
    }, true);

    $scope.$watch("searchTerm", function(searchTerm) {
        $scope.filteredContacts = filterContacts($scope.contacts, searchTerm);
    });

    ContactService.getAll({
        success: function(contacts) {
            $scope.contacts = contacts;
        }
    });
}]);