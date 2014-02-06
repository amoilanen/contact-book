var express = require('express');
var https = require('https');
var Datastore = require('nedb');

var DEFAULT_PORT = 8000;
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

var db = new Datastore({filename: 'contacts.nedb', autoload: true});
var app = express();

app.use(express.static(__dirname + '/../..'));
app.use(express.bodyParser());

function setResponseStatus(err, response) {
    if (err) {
        console.error(err);
        response.status(500);
    } else {
        response.status(200);
    }
}

app.get('/api/contacts', function(request, response) {
    db.find({name: CONTACTS_ENTRY_NAME}, function (err, docs) {
        setResponseStatus(err, response);

        var contacts = docs[0].entries;

        response.set('Content-Type', 'application/json');
        response.write(JSON.stringify(contacts));
        response.end();
    });
});

app.post('/api/contacts', function(request, response) {
    var contacts = request.body;

    db.update({name: CONTACTS_ENTRY_NAME},
              {name: CONTACTS_ENTRY_NAME, entries: contacts}, {}, function (err, numReplaced) {
        setResponseStatus(err, response);
        response.end();
    });
});

//Only needed during development to reset the list of contacts to defaults
app.get('/api/debug/contacts/restoreDefaults', function(request, response) {
    db.update({name: CONTACTS_ENTRY_NAME},
              {name: CONTACTS_ENTRY_NAME, entries: defaultContacts}, {}, function (err, numReplaced) {
        setResponseStatus(err, response);
        response.end();
    });
});

app.listen(DEFAULT_PORT);