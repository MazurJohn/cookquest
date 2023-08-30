import React, { useEffect, useState } from "react";
import { ref, get, onValue, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from "./firebase";

const ExperienceBar = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, `user/${user.uid}`);

        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setUserData(userData);
            }
          })
          .catch((error) => {
            console.error("Error getting user data:", error);
          });
      } else {
        setUserData(null);
      }

      if (userData && userData.exp >= userData.expToNextLevel) {
        const newLevel = userData.level + 1;
        const newExp = userData.exp - userData.expToNextLevel;
        const newExpToNextLevel = Math.round(
          (userData.expToNextLevel + userData.expToNextLevel) * 1.2
        );

        const userRef = ref(database, `user/${user.uid}`);
        update(userRef, {
          level: newLevel,
          expToNextLevel: newExpToNextLevel,
          exp: newExp,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [userData]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  const { level, exp, expToNextLevel } = userData;
  const progress = (exp / expToNextLevel) * 100;

  return (
    <div className="flex">
      <h3 className="mr-2">Рівень: {level}</h3>
      <div>
        <div
          style={{ width: "100px", backgroundColor: "#ccc" }}
          className="flex relative"
        >
          <p className="text-sm absolute left-8">
            {exp} / {expToNextLevel}
          </p>
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: "green",
              height: "20px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceBar;
