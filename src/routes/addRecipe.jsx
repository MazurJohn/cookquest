import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, child, update } from "firebase/database";
import { auth, database } from "../firebase";
import { v4 as uuidv4 } from "uuid";

export default function AddRecipe() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Закуска");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleAddRecipe = () => {
    const ingredientsArray = ingredients
      .split(",")
      .map((item) => capitalizeFirstLetter(item.trim()));

    const newRecipe = {
      id: uuidv4(),
      name,
      category,
      ingredients: ingredientsArray,
      description,
      checked: false,
      timestamp: new Date().getTime(),
    };
    addRecipeToDb(newRecipe, user.uid);
  };

  function addRecipeToDb(recipe, uid) {
    update(ref(database, "recipe/" + uid), {
      [recipe.name]: recipe,
    });
    console.log("Recipe added successfully.");
    setName("");
    setCategory("Закуска");
    setIngredients("");
    setDescription("");
  }

  return (
    <div className="flex flex-col items-center mt-10 border-8 rounded-md bg-amber-300 sm:w-auto w-11/12 sm:h-auto pr-5 pl-5 sm:pr-10 sm:pl-10 animate__animated animate__fadeInUp">
      <h1 className="text-2xl font-semibold m-4">Додати рецепт</h1>
      {user ? (
        <div className="sm:w-96 w-full flex flex-col">
          <div className="mb-4">
            <label className="block mb-1">Назва:</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Категорія:</label>
            <select
              className="w-full border px-3 py-2 rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Закуска">Закуска</option>
              <option value="Суп">Суп</option>
              <option value="Десерт">Десерт</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Інгредієнти:</label>
            <input
              type="text"
              placeholder="Розділяйте інгредієнти комою: 'Курка, картопля'..."
              className="w-full border px-3 py-2 rounded-md"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Опис:</label>
            <textarea
              className="w-full border px-3 py-2 rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddRecipe}
            className="bg-blue-500 text-white px-4 self-center py-2 mb-6 rounded-sm border-b-8 border-blue-600 mt-2 hover:bg-blue-800 active:border-b-0 active:py-3 transition-all ease-in-out"
          >
            Зберегти рецепт
          </button>
        </div>
      ) : (
        <p className="text-gray-600">Будь ласка, увійдіть, щоб додати рецепт</p>
      )}
    </div>
  );
}
