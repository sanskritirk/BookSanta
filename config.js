import * as firebase from 'firebase';
require ('@firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyDgaxpm3SygfHxva1r7Sad-ZicU9raSE2w",
    authDomain: "booksanta-c22ae.firebaseapp.com",
    databaseURL: "https://booksanta-c22ae.firebaseio.com",
    projectId: "booksanta-c22ae",
    storageBucket: "booksanta-c22ae.appspot.com",
    messagingSenderId: "682407911506",
    appId: "1:682407911506:web:efd81cb9616f7ee1d4ff8b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();