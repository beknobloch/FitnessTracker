// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
//import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBk5HBi0QgXuMqAUF5jNjS36zaBTFDRBZ8",
  authDomain: "fitness-tracker-a0407.firebaseapp.com",
  projectId: "fitness-tracker-a0407",
  storageBucket: "fitness-tracker-a0407.appspot.com",
  messagingSenderId: "929431558318",
  appId: "1:929431558318:web:008e312a3f0deddb17753f",
  measurementId: "G-EKKGR84M12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//export the stuff you need
//export const auth = getAuth(app)
export const db = getFirestore(app)