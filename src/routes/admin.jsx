import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, child, onValue, remove, update } from "firebase/database";
import { auth, database } from "../firebase";
import { useNavigate } from "react-router-dom";
import { addExperience } from "../firebase";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [uncheckedRecipes, setUncheckedRecipes] = useState([]);
  const usersRef = ref(database, "user");
  const recipesRef = ref(database, "recipe");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        get(child(usersRef, user.uid))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              if (userData.isAdmin) {
                setIsAdmin(true);
              }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      const unsubscribe = onValue(recipesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const uncheckedRecipesArray = [];
          for (const userId in data) {
            const userRecipes = data[userId];
            for (const recipeId in userRecipes) {
              const recipe = userRecipes[recipeId];
              if (!recipe.checked) {
                uncheckedRecipesArray.push({ ...recipe, userId, recipeId });
              }
            }
          }
          setUncheckedRecipes(uncheckedRecipesArray);
        }
      });

      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleCheckRecipe = (userId, recipeId) => {
    const recipeRef = ref(database, `recipe/${userId}/${recipeId}`);
    const updates = { checked: true };
    addExperience(userId, 25);
    update(recipeRef, updates)
      .then(() => {
        console.log("Recipe checked successfully.");
      })
      .catch((error) => {
        console.error("Error checking recipe: ", error);
      });
  };

  const handleDeleteRecipe = (userId, recipeId) => {
    const recipeRef = ref(database, `recipe/${userId}/${recipeId}`);
    remove(recipeRef)
      .then(() => {
        console.log("Recipe deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting recipe: ", error);
      });
  };

  if (!isAdmin) {
    return navigate("/");
  }

  return (
    <div className="flex flex-col items-center bg-white">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
      <h3 className="text-xl font-semibold mb-2">Unchecked Recipes:</h3>
      <ul className="list-disc ml-6">
        {uncheckedRecipes.map((recipe, index) => (
          <li key={index} className="mb-4">
            <h4 className="text-lg font-semibold mb-1">{recipe.name}</h4>
            <p className="text-gray-600">Category: {recipe.category}</p>
            <p className="text-gray-600">Description: {recipe.description}</p>
            <p className="text-gray-600">
              Ingredients: {recipe.ingredients.join(", ")}
            </p>
            <button
              onClick={() => handleCheckRecipe(recipe.userId, recipe.recipeId)}
              className="bg-blue-500 m-2 text-white px-4 py-2 rounded-sm border-b-8 border-blue-600 mt-2 hover:bg-blue-800 active:border-b-0 active:py-3 transition-all ease-in-out"
            >
              Check Recipe
            </button>
            <button
              onClick={() => handleDeleteRecipe(recipe.userId, recipe.recipeId)}
              className="bg-orange-500 m-2 text-white px-4 py-2 rounded-sm border-b-8 border-orange-600 mt-2 hover:bg-orange-800 active:border-b-0 active:py-3 transition-all ease-in-out"
            >
              Delete Recipe
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
