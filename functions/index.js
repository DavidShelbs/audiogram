const firestoreFunctions = require('./src/firestore/FirestoreFunctions');

exports.createEvent = firestoreFunctions.createEvent;
exports.getUserEvents = firestoreFunctions.getUserEvents;
exports.getEvent = firestoreFunctions.getEvent;
exports.toggleEventStatus = firestoreFunctions.toggleEventStatus;
exports.incrementMessageCount = firestoreFunctions.incrementMessageCount;
