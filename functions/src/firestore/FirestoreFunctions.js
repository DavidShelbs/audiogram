// functions/index.js
const { onRequest, onCall } = require("firebase-functions/v2/https");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("../../audiogram-20444-5696715b3110.json");
const admin = require('firebase-admin');

// Initialize admin if not already initialized
if (!admin.apps.length) {
    initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();
const auth = getAuth();

// Create Event Function (Callable)
exports.createEvent = onCall({ cors: true }, async (request) => {
    try {
        // Check if user is authenticated
        if (!request.auth) {
            throw new Error("Authentication required to create events");
        }

        const uid = request.auth.uid;
        const email = request.auth.token.email;
        const { eventName, eventDescription = "" } = request.data;

        // Validate input
        if (!eventName || typeof eventName !== 'string' || eventName.trim().length === 0) {
            throw new Error("Event name is required");
        }

        if (eventName.trim().length > 100) {
            throw new Error("Event name must be less than 100 characters");
        }

        if (eventDescription && eventDescription.length > 500) {
            throw new Error("Event description must be less than 500 characters");
        }

        // Generate event ID
        const sanitizedName = eventName.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const timestamp = Date.now().toString().slice(-6);
        const eventId = `${sanitizedName}-${timestamp}`;

        // Create event document
        const eventData = {
            eventId,
            eventName: eventName.trim(),
            eventDescription: eventDescription.trim(),
            createdBy: uid,
            createdByEmail: email,
            createdAt: new Date().toISOString(),
            isActive: true,
            messageCount: 0,
            settings: {
                allowAnonymous: true,
                requireApproval: false,
                maxRecordingDuration: 300, // 5 minutes in seconds
            }
        };

        // Save to Firestore
        await db.collection('events').doc(eventId).set(eventData);

        // Return success response
        return {
            success: true,
            eventId,
            eventUrl: `${process.env.SITE_URL || 'http://localhost:3000'}/audio-recorder?eventId=${eventId}`,
            message: "Event created successfully"
        };

    } catch (error) {
        console.error("Error creating event:", error);
        throw new Error(error.message || "Failed to create event");
    }
});

// Get Event Function (Callable) - for joining events
exports.getEvent = onCall({ cors: true }, async (request) => {
    try {
        const { eventId } = request.data;

        if (!eventId) {
            throw new Error("Event ID is required");
        }

        // Get event document
        const eventDoc = await db.collection('events').doc(eventId).get();

        if (!eventDoc.exists) {
            throw new Error("Event not found");
        }

        const eventData = eventDoc.data();

        // Check if event is active
        if (!eventData.isActive) {
            throw new Error("This event is no longer accepting messages");
        }

        // Return public event data (excluding sensitive info)
        return {
            success: true,
            event: {
                eventId: eventData.eventId,
                eventName: eventData.eventName,
                eventDescription: eventData.eventDescription,
                messageCount: eventData.messageCount || 0,
                settings: eventData.settings,
                createdAt: eventData.createdAt
            }
        };

    } catch (error) {
        console.error("Error getting event:", error);
        throw new Error(error.message || "Failed to get event");
    }
});

// Update message count when new audio message is added
exports.incrementMessageCount = onCall({ cors: true }, async (request) => {
    try {
        const { eventId } = request.data;

        if (!eventId) {
            throw new Error("Event ID is required");
        }

        // Check if event exists
        const eventRef = db.collection('events').doc(eventId);
        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            throw new Error("Event not found");
        }

        // Increment message count
        await eventRef.update({
            messageCount: (eventDoc.data().messageCount || 0) + 1,
            lastMessageAt: new Date().toISOString()
        });

        return { success: true };

    } catch (error) {
        console.error("Error incrementing message count:", error);
        throw new Error(error.message || "Failed to update message count");
    }
});

// Get events for authenticated user (for dashboard/management)
exports.getUserEvents = onCall({ cors: true }, async (request) => {
    try {
        if (!request.auth) {
            throw new Error("Authentication required");
        }

        const { uid } = request.auth;

        // Get events created by this user
        const eventsSnapshot = await db.collection('events')
            .where('createdBy', '==', uid)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        const events = [];
        eventsSnapshot.forEach(doc => {
            events.push({
                ...doc.data(),
                id: doc.id
            });
        });

        return {
            success: true,
            events
        };

    } catch (error) {
        console.error("Error getting user events:", error);
        throw new Error(error.message || "Failed to get events");
    }
});

// Toggle event active status
exports.toggleEventStatus = onCall({ cors: true }, async (request) => {
    try {
        if (!request.auth) {
            throw new Error("Authentication required");
        }

        const { uid } = request.auth;
        const { eventId, isActive } = request.data;

        if (!eventId) {
            throw new Error("Event ID is required");
        }

        // Check if user owns this event
        const eventRef = db.collection('events').doc(eventId);
        const eventDoc = await eventRef.get();

        if (!eventDoc.exists) {
            throw new Error("Event not found");
        }

        if (eventDoc.data().createdBy !== uid) {
            throw new Error("You don't have permission to modify this event");
        }

        // Update event status
        await eventRef.update({
            isActive: Boolean(isActive),
            updatedAt: new Date().toISOString()
        });

        return { success: true };

    } catch (error) {
        console.error("Error toggling event status:", error);
        throw new Error(error.message || "Failed to update event status");
    }
});