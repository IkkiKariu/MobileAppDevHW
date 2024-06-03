// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMIS-tKIEwaC1q3e8ItfYw45Atf5Mx-7U",
  authDomain: "m-app-8d370.firebaseapp.com",
  projectId: "m-app-8d370",
  storageBucket: "m-app-8d370.appspot.com",
  messagingSenderId: "363637533751",
  appId: "1:363637533751:web:f5d56abca523b3491ea3b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;