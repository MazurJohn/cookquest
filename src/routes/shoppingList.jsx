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
import { Button } from "@material-tailwind/react";
import AlertDialog from "../dialog";

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [user, setUser] = useState(null);
  const [crossedIngredients, setCrossedIngredients] = useState([]);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const openInfoDialog = () => {
    setInfoDialogOpen(true);
  };

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
  };

  useEffect(() => {
    if (user) {
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
    }
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
      <AlertDialog
        open={infoDialogOpen}
        onClose={closeInfoDialog}
        title="Очистити список?"
        content="Бажаєте повністю очистити Список Покупок?"
        onConfirm={handleClearList}
      />
      <h2 className="text-xl font-semibold mb-4 bg-yellow-100">
        Список покупок
      </h2>
      <div className="flex justify-center w-56 text-lg bg-yellow-100">
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
                  className={`cursor-pointer list_item text-2xl ${
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
        <Button className="mt-5" color="red" onClick={openInfoDialog}>
          Очистити список
        </Button>
      )}
    </div>
  );
};

export default ShoppingList;
