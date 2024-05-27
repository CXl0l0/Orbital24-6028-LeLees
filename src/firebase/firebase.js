// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHvRfkAecg8lOMYrWFyKeWQYwesCOLqF0",
  authDomain: "orbital-2024-e46e8.firebaseapp.com",
  projectId: "orbital-2024-e46e8",
  storageBucket: "orbital-2024-e46e8.appspot.com",
  messagingSenderId: "697811302614",
  appId: "1:697811302614:web:56d0aa5347908b4c54b177",
  measurementId: "G-RQTZ5BFDMJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, analytics, db };
