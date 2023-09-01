import React, { useState, useEffect } from "react";
import { getDatabase, ref, update, onValue, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Tooltip } from "@material-tailwind/react";

const RecipeBook = () => {
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState({});
  const [allIngredients, setAllIngredients] = useState(new Set());
  const [selectedIngredients, setSelectedIngredients] = useState(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [missingIngredients, setMissingIngredients] = useState(new Set());
  const [visibleRecipeCount, setVisibleRecipeCount] = useState(5);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    const database = getDatabase();
    const recipesRef = ref(database, "recipe");
    const usersRef = ref(database, "user");

    // Отримання даних один раз при завантаженні компоненту
    get(recipesRef)
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          const checkedRecipes = [];
          for (const userId in data) {
            const userRecipes = data[userId];
            for (const recipeId in userRecipes) {
              const recipe = userRecipes[recipeId];
              if (recipe.checked) {
                checkedRecipes.push({ ...recipe, userId, recipeId });
                recipe.ingredients.forEach((ingredient) => {
                  allIngredients.add(ingredient);
                });
              }
            }
          }
          const sortedRecipes = checkedRecipes
            .slice()
            .sort((a, b) => b.timestamp - a.timestamp);
          setRecipes(sortedRecipes);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    get(usersRef)
      .then((snapshot) => {
        setUsers(snapshot.val() || {});
      })
      .catch((error) => {
        console.error(error);
      });

    const userId = auth.currentUser?.uid;
    if (userId) {
      const userRef = ref(database, `user/${userId}`);
      get(userRef)
        .then((snapshot) => {
          const userData = snapshot.val();
          if (userData && userData.shoppingList) {
            setMissingIngredients(new Set(userData.shoppingList));
          } else {
            setMissingIngredients(new Set());
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const handleIngredientClick = (ingredient) => {
    if (selectedIngredients.has(ingredient)) {
      const newSelectedIngredients = new Set(selectedIngredients);
      newSelectedIngredients.delete(ingredient);
      setSelectedIngredients(newSelectedIngredients);
    } else {
      const newSelectedIngredients = new Set(selectedIngredients);
      newSelectedIngredients.add(ingredient);
      setSelectedIngredients(newSelectedIngredients);
    }
  };

  const handleAddToShoppingList = (recipeIngredients) => {
    const user = auth.currentUser;
    if (user) {
      const newMissingIngredients = new Set([...missingIngredients]);
      recipeIngredients.forEach((ingredient) => {
        if (!selectedIngredients.has(ingredient)) {
          newMissingIngredients.add(ingredient);
        }
      });
      setMissingIngredients(newMissingIngredients);

      const userId = auth.currentUser.uid;
      const database = getDatabase();
      const userRef = ref(database, `user/${userId}`);
      update(userRef, {
        shoppingList: Array.from(newMissingIngredients),
      });
      console.log("Інгредієнти додано до списку покупок");
    } else {
      alert("Увійдіть за допомогою Google акаунту");
    }
  };

  const showMoreRecipes = () => {
    setVisibleRecipeCount((prevCount) => prevCount + 10); // Показуємо наступні 10 рецептів
  };

  const toggleExpandRecipe = (recipeId) => {
    setExpandedRecipeId((prevId) => (prevId === recipeId ? null : recipeId));
  };

  const isIngredientSelected = (ingredient) =>
    selectedIngredients.has(ingredient);

  const ingredientStyle = (ingredient) => {
    return isIngredientSelected(ingredient) ? "text-lime-600" : "";
  };

  const filteredIngredients = Array.from(allIngredients).filter((ingredient) =>
    ingredient.toLowerCase().includes(searchInput.toLowerCase())
  );

  const filteredRecipes =
    selectedIngredients.size > 0
      ? recipes.filter((recipe) =>
          recipe.ingredients.some((ingredient) =>
            selectedIngredients.has(ingredient)
          )
        )
      : recipes;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-center text-sm mt-2 overflow-x-hidden">
      <div className="flex flex-row m-8 justify-around h-96 sm:h-screen sm:gap-2 animate__animated animate__fadeInLeft">
        <div className="ingredient-list flex flex-col border rounded-l-md sm:border-8 bg-white w-1/2 sm:w-64 overflow-x-hidden">
          <h3 className="m-1 self-center">Усі інгредієнти:</h3>
          <input
            type="text"
            placeholder="Пошук..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border-2 rounded-xl pl-2 mb-2 w-11/12 self-center"
          />
          {filteredIngredients.map((ingredient, index) => (
            <p
              key={index}
              onClick={() => handleIngredientClick(ingredient)}
              className={`cursor-pointer ${ingredientStyle(
                ingredient
              )} p-2 sm:p-0 m-1 mb-0 text-center rounded-xl bg-amber-300`}
            >
              {ingredient}
            </p>
          ))}
        </div>
        <div className="selected-ingredients flex flex-col border rounded-r-md sm:border-8 bg-white w-1/2 sm:w-64 overflow-x-hidden">
          <h3 className="m-1 self-center">Обрані:</h3>
          {Array.from(selectedIngredients).map((ingredient, index) => (
            <p
              key={index}
              onClick={() => handleIngredientClick(ingredient)}
              className="cursor-pointer selected-ingredient p-2 sm:p-0 m-1 mb-0 text-center rounded-xl bg-amber-300"
            >
              {ingredient}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start m-8 animate__animated animate__fadeInRight">
        <ul className="w-full flex flex-col">
          {filteredRecipes.slice(0, visibleRecipeCount).map((recipe, index) => (
            <li
              key={index}
              className="bg-amber-300 mb-5 w-full sm:w-96 flex flex-col p-4 border-8 rounded-md gap-3"
            >
              <h4 className="text-2xl">
                {recipe.name} (від{" "}
                <span className="text-sky-600">
                  {users[recipe.userId]?.userName || "Анонімний користувач"}
                </span>
                )
              </h4>
              <p>Категорія: {recipe.category}</p>
              <p className="bg-yellow-100 rounded-md pl-2">
                Інгредієнти:{" "}
                {recipe.ingredients.map((ingredient, i) => (
                  <span
                    key={i}
                    className={`ingredient ${ingredientStyle(ingredient)}`}
                  >
                    {ingredient}
                    {i !== recipe.ingredients.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p>
                Опис:{" "}
                {recipe.description.length > 50 &&
                expandedRecipeId === recipe.recipeId
                  ? recipe.description
                  : `${recipe.description.slice(0, 50)}...`}
                {recipe.description.length > 50 && (
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => toggleExpandRecipe(recipe.recipeId)}
                  >
                    {expandedRecipeId === recipe.recipeId
                      ? "Згорнути"
                      : "Детальніше"}
                  </span>
                )}
              </p>
              <p>Додано: {new Date(recipe.timestamp).toLocaleString()}</p>
              {recipe.ingredients.some(
                (ingredient) => !selectedIngredients.has(ingredient)
              ) && (
                <Tooltip
                  className="h-15 text-md"
                  content="Додати невистачаючі інгредієнти у список покупок"
                >
                  <button
                    className="bg-blue-500 self-center text-white px-4 py-2 rounded-sm border-b-8 border-blue-600 mt-2 hover:bg-blue-800 active:border-b-0 active:py-3 transition-all ease-in-out relative group"
                    onClick={() => handleAddToShoppingList(recipe.ingredients)}
                  >
                    Хочу приготувати!
                  </button>
                </Tooltip>
              )}
            </li>
          ))}
        </ul>
        {visibleRecipeCount < filteredRecipes.length && (
          <button
            className="bg-emerald-500 text-white px-4 py-2 rounded-sm border-b-8 border-emerald-600 mt-2 hover:bg-emerald-800 active:border-b-0 active:py-3 transition-all ease-in-out"
            onClick={showMoreRecipes}
          >
            Показати більше рецептів
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeBook;
