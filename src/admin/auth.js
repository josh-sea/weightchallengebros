import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCo73lHDYN3VOuf-Q0nNXhU_YtBH4DJTZ4",
  authDomain: "weight-bro-challenge.firebaseapp.com",
  projectId: "weight-bro-challenge",
  storageBucket: "weight-bro-challenge.appspot.com",
  messagingSenderId: "87540118116",
  appId: "1:87540118116:web:6974dc85772319e77be571"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);



export { app, auth, database } ;