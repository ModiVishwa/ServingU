import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDj85B1hAsHusZHqNNZRHoY7W9Xsry0Ovc",
    authDomain: "serving-you-956bf.firebaseapp.com",
    projectId: "serving-you-956bf",
    storageBucket: "serving-you-956bf.appspot.com",
    messagingSenderId: "484120502217",
    appId: "1:484120502217:web:623c07d68496a331085218",
    measurementId: "G-05TCHHM4KZ"
  };
  

  export const app = initializeApp(firebaseConfig);
  export const my_db = getFirestore(app)
 export const image_db= getStorage(app)
 export const auth = getAuth(app)
  
