import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAyfsdJIXozS-z4kB1IjiNSwkBZL-M7IYY",
  authDomain: "tabi-ignite.firebaseapp.com",
  projectId: "tabi-ignite",
  storageBucket: "tabi-ignite.firebasestorage.app",
  messagingSenderId: "912944296995",
  appId: "1:912944296995:web:b269ce4fe5e47e31ee6d96",
  measurementId: "G-FSYGFDD18X",
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig)

// Initialize Firebase Auth
const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)

// Initialize Firebase Storage
const storage = getStorage(app)

// Export Firebase auth instance
export { auth }

// Export Firestore instance
export { db }

// Export Firebase Storage instance
export { storage }

// Export Firebase app instance for other services
export { app }

// Export Firebase config for reference
export { firebaseConfig }
