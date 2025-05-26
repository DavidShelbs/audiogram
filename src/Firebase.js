import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/functions/local-emulator#instrument-functions
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
// https://firebase.google.com/docs/emulator-suite/connect_firestore#android_apple_platforms_and_web_sdks
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {getAuth, connectAuthEmulator} from "firebase/auth";
import {getStorage} from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbuQ1iXQFUgFCqb1uF4ZI4rjwNvwPas2Q",
    authDomain: "audiogram-20444.firebaseapp.com",
    projectId: "audiogram-20444",
    storageBucket: "audiogram-20444.firebasestorage.app",
    messagingSenderId: "822494601656",
    appId: "1:822494601656:web:629cdab80c27cb53b86f4d",
    measurementId: "G-JBBY55JE34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
// const auth = getAuth(app);
// if (window.location.hostname === "localhost") {
//     console.log(
//         "Testing locally: hitting local functions and firestore emulators."
//     );
//     connectFunctionsEmulator(functions, "127.0.0.1", 5001);
//     connectFirestoreEmulator(firestore, "127.0.0.1", 5002);
//     // connectAuthEmulator(auth, "http://127.0.0.1:5003");
// }

export { analytics, functions, firestore, storage };
// export { analytics, auth, functions, firestore };