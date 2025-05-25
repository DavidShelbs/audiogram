import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/functions/local-emulator#instrument-functions
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// https://firebase.google.com/docs/emulator-suite/connect_firestore#android_apple_platforms_and_web_sdks
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {getAuth, connectAuthEmulator} from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAmlqQJCkGxzMQs-p3sH90pmST3NWo5cFQ",
    authDomain: "empire-web-app.firebaseapp.com",
    projectId: "empire-web-app",
    storageBucket: "empire-web-app.firebasestorage.app",
    messagingSenderId: "1078696875100",
    appId: "1:1078696875100:web:c61f6613a5bd0216458299",
    measurementId: "G-KD80W8EJPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app);
const firestore = getFirestore(app);
// const auth = getAuth(app);
if (window.location.hostname === "localhost") {
    console.log(
        "Testing locally: hitting local functions and firestore emulators."
    );
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    connectFirestoreEmulator(firestore, "127.0.0.1", 5002);
    // connectAuthEmulator(auth, "http://127.0.0.1:5003");
}

export { analytics, functions, firestore };
// export { analytics, auth, functions, firestore };