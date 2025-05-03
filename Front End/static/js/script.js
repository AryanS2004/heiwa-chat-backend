import { signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { doc, getFirestore, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { auth, provider } from './firebase-config.js';

// Function to log in with Google
export function loginWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            // Show a welcome message
            alert("Welcome, " + user.displayName);

            // Create a document in Firestore for the user
            const userRef = doc(getFirestore(), "users", user.uid);
            setDoc(userRef, {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            }).then(() => {
                // Redirect to the chat page after successful login and saving user data
                window.location.href = "/chat";  // Use Flask route instead of direct file path
            }).catch((error) => {
                alert("Error saving user info: " + error.message);
            });
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}
