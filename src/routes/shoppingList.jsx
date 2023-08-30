import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  update,
  set,
  remove,
  onValue,
  get,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [user, setUser] = useState(null);
  const [crossedIngredients, setCrossedIngredients] = useState([]);

  useEffect(() => {
    const database = getDatabase();
    const shoppingListRef = ref(database, `user/${user?.uid}`);

    const unsubscribeShoppingList = onValue(shoppingListRef, (snapshot) => {
      const data = snapshot.val();
      if (data.shoppingList) {
        setShoppingList(data.shoppingList);
      } else {
        setShoppingList([]);
      }
    });

    return () => {
      unsubscribeShoppingList();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handleRemoveItem = (item) => {
    const updatedList = shoppingList.filter(
      (ingredient) => ingredient !== item
    );

    const database = getDatabase();
    const shoppingListRef = ref(database, `user/${user?.uid}/shoppingList`);
    set(shoppingListRef, updatedList);
  };

  const handleClearList = () => {
    const database = getDatabase();
    const shoppingListRef = ref(database, `user/${user?.uid}/shoppingList`);
    remove(shoppingListRef);
  };

  const toggleCrossedIngredient = (ingredient) => {
    if (crossedIngredients.includes(ingredient)) {
      setCrossedIngredients(
        crossedIngredients.filter((item) => item !== ingredient)
      );
    } else {
      setCrossedIngredients([...crossedIngredients, ingredient]);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 animate__animated animate__fadeInUp">
      <h2 className="text-xl font-semibold mb-4 bg-white">Список покупок</h2>
      <div className="flex justify-center w-56 text-lg bg-white">
        {shoppingList.length === 0 ? (
          <p>Список порожній</p>
        ) : (
          <ul className="w-full">
            {shoppingList.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between space-x-2 mb-2 border-b-2"
              >
                <span
                  className={`cursor-pointer ${
                    crossedIngredients.includes(item)
                      ? "line-through text-gray-500"
                      : "text-black"
                  }`}
                  onClick={() => toggleCrossedIngredient(item)}
                >
                  {item}
                </span>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="text-red-500 hover:scale-110 transition-all ease-in-out"
                >
                  ⌫
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {shoppingList.length > 0 && (
        <button
          onClick={handleClearList}
          className="bg-orange-500 text-white px-4 py-2 rounded-sm border-b-8 border-orange-600 mt-2 hover:bg-orange-800 active:border-b-0 active:py-3 transition-all ease-in-out"
        >
          Очистити список
        </button>
      )}
    </div>
  );
};

export default ShoppingList;
