// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8PD-lH7Kn0k3BgYp6QI06e0q5Ee4C4Xo",
  authDomain: "calhacks11-52247.firebaseapp.com",
  projectId: "calhacks11-52247",
  storageBucket: "calhacks11-52247.appspot.com",
  messagingSenderId: "295453296860",
  appId: "1:295453296860:web:d4b8437eff0d7ca97a4c19",
  measurementId: "G-DSVS65B6R6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
