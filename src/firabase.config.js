// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM_cPagchVpJD4Qd2AYX_A5S032JCQ-hQ",
  authDomain: "house-marketplace-id.firebaseapp.com",
  projectId: "house-marketplace-id",
  storageBucket: "house-marketplace-id.appspot.com",
  messagingSenderId: "518406215248",
  appId: "1:518406215248:web:0e3778141cae21a03ce355",
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
