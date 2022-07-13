// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_8Gu_HPXFnomcFKSMDAhBAQZ2IxFPQbg",
  authDomain: "image-uploader-e0ce5.firebaseapp.com",
  projectId: "image-uploader-e0ce5",
  storageBucket: "image-uploader-e0ce5.appspot.com",
  messagingSenderId: "1088701901358",
  appId: "1:1088701901358:web:7eaeaa450f543e53514dbf",
  measurementId: "G-K28N16QD07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);