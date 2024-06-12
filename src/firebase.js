import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDrCGe8JxJGWwwiYTr-EDNqfMqilb0ryZM",
  authDomain: "system-serv.firebaseapp.com",
  databaseURL: "https://system-serv-default-rtdb.firebaseio.com",
  projectId: "system-serv",
  storageBucket: "system-serv.appspot.com",
  messagingSenderId: "602563437661",
  appId: "1:602563437661:web:80a8a26ca50a46b2ae99b4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
