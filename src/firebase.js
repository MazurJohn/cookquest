import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  update,
  set,
  runTransaction,
} from "firebase/database";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsjpBRrxzw1nU_vTMgSwpScZx4AWJMDN4",
  authDomain: "recipe-database-rpg.firebaseapp.com",
  projectId: "recipe-database-rpg",
  storageBucket: "recipe-database-rpg.appspot.com",
  messagingSenderId: "937166830017",
  appId: "1:937166830017:web:25655ff700077f6c509740",
  databaseURL:
    "https://recipe-database-rpg-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
      addNewUserToDb(result.user);
    })
    .catch((error) => {
      console.log(error);
    });
};

function addNewUserToDb(user) {
  set(ref(database, "user/" + user.uid), {
    userName: user.displayName,
    userPhoto: user.photoURL,
    isAdmin: false,
    level: 1,
    exp: 0,
    expToNextLevel: 100,
  });
}

export const addExperience = (userId, amount) => {
  const userRef = ref(database, `user/${userId}/exp`);

  runTransaction(userRef, (currentExp) => {
    if (currentExp === null) {
      return amount;
    }
    return currentExp + amount;
  });
};

export async function signOutFunc() {
  try {
    await signOut(auth);
    location.reload();
    console.log("Користувач вийшов з системи");
  } catch (error) {
    console.log("Помилка під час виходу користувача:", error);
  }
}

export { app, auth, database };
