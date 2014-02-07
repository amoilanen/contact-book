Contact Book, version 0.0.1
============

Allows you to organize your contacts. Note, as of now this is still work in progress, the application now works only in the single user mode.

* Written with HTML, JavaScript, CSS
* Can work offline
* Contacts can always be stored to the cloud when connection appears
* Can work in the standalone mode without server (configurable during installation)
* Fast and lightweight

## How To Use

The interface is self-explanatory. On the left hand side there is a list of the all available contacts are listed ordered alphabetically by their first and last names.

#### Adding a contact

Activate the '+' button right of the search field.

#### Deleting a contact

Activate the 'x' button next to the contact or in the contact details panel.

#### Viewing contact details

Activate a contact, it will become highlighted in the list of contacts and the contact details panel will be shown.

#### Closing contact details

Activate the eye-close icon on the contact details panel, the panel will be hidden.

#### Changing a contact

Open the contact details panel by selecting the contact in the list of contacts and edit the contact details. The changes will be automatically saved locally without any extra actions.

#### Store to cloud

If you want to store the local changes to the cloud to be available in the next session, just activate the
button with a cloud and an arrow.

## Running Contact Book

It is recommended to use a modern browser that supports local storage. Building of the application is at the moment an optional step, you can run it directly from the sources.

#### Local storage mode

This is the default mode, in this mode no server is required, the browser local storage will be used to save the retrieve the contacts.

##### No web server

In this mode you do not even need to have a web server, `index.html` can just be opened in a browser and the application will be fully functional. Storing to the cloud in this case will be storing to the browser local storage.

If you want to reset the state of the local storage to defaults, execute the following code in the browser console (as of now no separate button for this in the application):

```javascript
localStorage.removeItem("contacts-book-contacts");
```

##### With Node.js Express web server

Install Node.js [node-js][node-js] if you do not yet have it on your machine, run `npm install` in the root of the project to install the needed dependencies.

Run the server in `server/src` with `node server.local.storage.js`. The server will serve the application at `http://localhost:8000`.

#### Server mode

Install Node.js [node-js][node-js] if you do not yet have it on your machine, run `npm install` in the root of the project to install the needed dependencies.

Run the server in `server/src` with `node server.js`. The server will store the contacts to the disk when asked in `contacts.nedb`. The server will serve the application at `http://localhost:8000`.

In `index.html` substitute the local storage version of the service providing contacts with the server storage one. Change

```
    <script src="client/src/localstorage.js"></script>
    <!--<script src="client/src/serverstorage.js"></script>-->
```

to

```
    <!--<script src="client/src/localstorage.js"></script>-->
    <script src="client/src/serverstorage.js"></script>
```

## Setting Up Development Environment

Install Node.js [node-js][node-js] if you do not yet have it on your machine.

Run `npm install` in the root of the project, this will download the Node modules you need during
development. Then run `npm install -g grunt-cli` to install the grunt command line interface which is a requirement for being able to build the project.

#### Running tests

To run unit tests execute `grunt karma:unit`, end-to-end tests `grunt karma:e2e`. All tests can be run with `grunt karma`.

For running end-to-end tests a local instance of the application should be available at `http://localhost:8000`, please, refer to the section on how to configure and launch the application. Also it is assumed that the default list of contacts is available for the application.

#### Building project

Build can be run by running `grunt` in the root of the project. By default the unit tests will be run as part of the build.

#### Changing source

Currently no source minification is performed and the application load unminified source files (both JavaScript and CSS). Changes in the source code then will be picked up automatically provided the browser caching is switched off.

[node-js]: http://nodejs.org/