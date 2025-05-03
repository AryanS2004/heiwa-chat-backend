// Import functions from Firebase
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { addDoc, collection, db } from './firebase-config.js';

// Initialize Firebase Authentication
const auth = getAuth();  // Initialize auth

// Function to send a message to Firestore
function sendMessage() {
    const message = document.getElementById("message").value;

    if (message.trim() === "") {
        alert("Please enter a message!");
        return;
    }

    const user = auth.currentUser;
    const username = user ? user.displayName : "Anonymous";

    // Send message to Flask backend for prediction first
    fetch('https://heiwa-chat-backend.onrender.com/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
    })
    .then(response => response.json())
    .then(data => {
        const prediction = data.prediction;
    
        // Check prediction result
        console.log("Prediction received from backend:", prediction);  // Log prediction for debugging
    
        if (prediction === 'Offensive') {
            alert('⚠️ Cyberbullying detected! Message not sent.');
        } else if (prediction === 'Non-offensive') {
            // If the message is non-offensive, send it to Firestore
            addDoc(collection(db, "messages"), {
                text: message,
                timestamp: new Date(),
                user: username,
            })
            .then(() => {
                alert("Message sent!");
                document.getElementById("message").value = "";  // Clear the input field
            })
            .catch((error) => {
                alert("Error sending message: " + error.message);
            });
        } else {
            alert('⚠️ Cannot predict the message.');
        }
    })
    .catch((error) => {
        alert('Error: ' + error.message);
    });
}

// Make sendMessage global
window.sendMessage = sendMessage;

// Load messages when the page loads
window.onload = function () {
    loadMessages();
    // Display user info (name and logout button)
};

// Function to scroll to the latest message
function scrollToBottom() {
    const messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to load messages from Firestore and display them
function loadMessages() {
    const messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.innerHTML = '';  // Clear previous messages

    toggleLoading(true);  // Show loading indicator

    // Get messages from Firestore in real-time, ordered by timestamp
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));  // Order by timestamp in ascending order

    onSnapshot(messagesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const messageData = change.doc.data();
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");

                messageElement.innerHTML = `
                    <strong>${messageData.user}</strong>: ${messageData.text} <br>
                    <small>${messageData.timestamp.toDate().toLocaleString()}</small>
                `;
                messagesContainer.appendChild(messageElement);
            }
        });

        toggleLoading(false);  // Hide loading indicator
        scrollToBottom();  // Scroll to the latest message after adding
    });
}

function toggleLoading(show) {
    const loadingElement = document.getElementById("loading");
    if (loadingElement) {
        loadingElement.style.display = show ? "block" : "none";
    }
}
