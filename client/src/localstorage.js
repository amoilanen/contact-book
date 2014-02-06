/*
 * To reset the state of the application just execute in the browser console:
 * localStorage.removeItem("contacts-book-contacts");
 */

var app = app || angular.module('ContactsBook', []);

app.factory('ContactService', function() {
    var CONTACTS_ENTRY_NAME = "contacts-book-contacts";

    function contact(id, firstName, lastName, phone, eMail) {
        return {
            id: id,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            eMail: eMail
        };
    }

    var defaultContacts = [
        contact(0, "John", "Doherty", "+1-555-555-5555", "doherty.jh@example.com"),
        contact(1, "Alex", "Wood", "+1-555-555-5555", "alex.wood@example.com"),
        contact(2, "Rebecca", "Dijksma", "+1-555-555-5555", "reb-dijksma@example.com"),
        contact(3, "Catherine", "Svenson", "+1-555-555-5555", "cathey@example.com"),
        contact(4, "Anton", "Steinmeyer", "+1-555-555-5555", "anton-steinmeyer@example.com")
    ];

    var isStorageSupported = true;

    if (typeof(Storage) === "undefined") {
        isStorageSupported = false;
    }

    return {
        getAll: function(callbacks) {
            var storedContacts = isStorageSupported ? localStorage.getItem(CONTACTS_ENTRY_NAME) : null;
            var contacts = storedContacts ? JSON.parse(storedContacts) : defaultContacts;

            if (callbacks && callbacks.success) {
                callbacks.success(contacts);
            }
        },
        storeAll: function(contacts, callbacks) {
            if (isStorageSupported) {
                localStorage.setItem(CONTACTS_ENTRY_NAME, JSON.stringify(contacts));
            }
            if (callbacks && callbacks.success) {
                callbacks.success(contacts);
            }
        }
    };
});