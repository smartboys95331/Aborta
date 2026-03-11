import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyB29tzhZtFmDnsJAFjvwrXv78MQnFJ7QTk",
    authDomain: "discord-cbeb9.firebaseapp.com",
    projectId: "discord-cbeb9",
    storageBucket: "discord-cbeb9.firebasestorage.app",
    messagingSenderId: "297179277069",
    appId: "1:297179277069:web:57251be76cb11c2f323244",
    measurementId: "G-8DF0XRN7S4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// UI Elements
const authBtn = document.getElementById('auth-btn');
const userInfo = document.getElementById('user-info');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageFeed = document.getElementById('message-container');

// 1. Auth Logic
authBtn.onclick = () => {
    if (auth.currentUser) {
        signOut(auth);
    } else {
        const email = prompt("Enter email:");
        const pass = "123456"; // Simplified for your first version
        signInWithEmailAndPassword(auth, email, pass).catch(() => {
            createUserWithEmailAndPassword(auth, email, pass);
        });
    }
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        userInfo.innerText = user.email.split('@')[0];
        authBtn.innerText = "Logout";
    } else {
        userInfo.innerText = "Logged Out";
        authBtn.innerText = "Login";
    }
});

// 2. Chat Logic
messageForm.onsubmit = (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Please login first!");
    
    if (messageInput.value.trim()) {
        push(ref(db, 'messages'), {
            user: auth.currentUser.email.split('@')[0],
            text: messageInput.value,
            timestamp: Date.now()
        });
        messageInput.value = "";
    }
};

// 3. Real-time Listener
onChildAdded(ref(db, 'messages'), (snapshot) => {
    const data = snapshot.val();
    const msgDiv = document.createElement('div');
    msgDiv.className = "message-item"; // You can style this in CSS
    msgDiv.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
    messageFeed.appendChild(msgDiv);
    messageFeed.scrollTop = messageFeed.scrollHeight;
});