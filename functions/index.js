const firestoreFunctions = require('./src/firestore/FirestoreFunctions');

exports.createEvent = firestoreFunctions.createEvent;
exports.getUserEvents = firestoreFunctions.getUserEvents;
exports.getEvent = firestoreFunctions.getEvent;
exports.toggleEventStatus = firestoreFunctions.toggleEventStatus;
exports.incrementMessageCountOnCreate = firestoreFunctions.incrementMessageCountOnCreate;
exports.decrementMessageCountOnDelete = firestoreFunctions.decrementMessageCountOnDelete;
exports.loadMessagesForEvent = firestoreFunctions.loadMessagesForEvent;