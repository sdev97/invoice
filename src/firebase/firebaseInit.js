import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyAm-xiBqW_u-7EDEguJxJPEo9QEdUXozko",
    authDomain: "invoice-b94bd.firebaseapp.com",
    projectId: "invoice-b94bd",
    storageBucket: "invoice-b94bd.appspot.com",
    messagingSenderId: "970716718822",
    appId: "1:970716718822:web:25c11622f97f0c2d3ffd27",
    measurementId: "G-R00MT25TVV"
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp.firestore();