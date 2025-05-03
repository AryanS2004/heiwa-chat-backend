// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { addDoc, collection, getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration object (Replace with your Firebase project details)
const firebaseConfig = {
    apiKey: "AIzaSyBbXYIP309qQIGLfmUBx6BcgDEM437Xurc",
    authDomain: "chatapp-by-as.firebaseapp.com",
    projectId: "chatapp-by-as",
    storageBucket: "chatapp-by-as.appspot.com",
    messagingSenderId: "589095194722",
    appId: "1:589095194722:web:87223d4d4fc31e17a8c13b",
    measurementId: "G-4BWBRNSGQZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Firestore
const db = getFirestore(app);

// Exporting Firebase functions
export { addDoc, auth, collection, db, getAuth, GoogleAuthProvider, provider, signInWithPopup, signOut };

