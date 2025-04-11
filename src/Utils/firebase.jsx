// src/Utils/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import auth

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Set up a null analytics object by default
let analytics = null;

// Only try to initialize analytics in production environment
if (import.meta.env.PROD) {
  // Use dynamic import to load analytics only when needed
  import("firebase/analytics").then((analyticsModule) => {
    analyticsModule.isSupported().then((isSupported) => {
      if (isSupported) {
        analytics = analyticsModule.getAnalytics(app);
        console.log("Analytics initialized successfully");
      } else {
        console.log("Analytics not supported in this environment");
      }
    }).catch((error) => {
      console.log("Error checking analytics support:", error);
    });
  }).catch((error) => {
    console.log("Error loading analytics module:", error);
  });
} else {
  console.log("Analytics not initialized in development mode");
}

export { app, analytics, auth };
