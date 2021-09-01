import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDas2GEnd480jHaPdXB-ko1x6xq-jBN-qM",
  authDomain: "getvokl-thp.firebaseapp.com",
  projectId: "getvokl-thp",
  storageBucket: "getvokl-thp.appspot.com",
  messagingSenderId: "575652590174",
  appId: "1:575652590174:web:5792c60b3c64bdcbddbacf",
};

const app = Firebase.initializeApp(firebaseConfig);
export default app;
