import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { getDatabase, ref, get, remove } from "firebase/database";
import ExperienceBar from "../expBar";
import { Card, CardBody, Button } from "@material-tailwind/react";

const InfoList = () => {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const db = getDatabase();

  useEffect(() => {
    if (user) {
      const recipesRef = ref(db, `recipe/${user.uid}`);

      get(recipesRef).then((snapshot) => {
        if (snapshot.exists()) {
          setRecipes(snapshot.val());
        }
      });
    }
  }, [user, db]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
    });

    return () => unsubscribe();
  }, []);

  const handleRecipeDelete = (recipeId) => {
    const recipeRef = ref(db, `recipe/${user.uid}/${recipeId}`);
    remove(recipeRef)
      .then(() => {
        // Оновлюємо список рецептів після видалення
        const updatedRecipes = { ...recipes };
        delete updatedRecipes[recipeId];
        setRecipes(updatedRecipes);
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
      });
  };

  return (
    <div className="flex justify-center mt-10 animate__animated animate__fadeInUp">
      <Card className="mt-6 w-96">
        <CardBody className="flex flex-col items-center">
          {user ? (
            <>
              <ExperienceBar />
              <h2 className="text-xl text-center font-semibold m-4">
                Ваші рецепти
              </h2>
              <ul className="list-disc m-6 flex flex-col">
                {Object.entries(recipes).map(([recipeId, recipe]) => (
                  <li
                    key={recipeId}
                    className="flex items-center justify-between space-x-2 mb-2"
                  >
                    <span className="mr-2">{recipe.name}</span>
                    <Button
                      color="red"
                      onClick={() => handleRecipeDelete(recipeId)}
                    >
                      Видалити
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-gray-600">
              Увійдіть за допомогою Google акаунту
            </p>
          )}
        </CardBody>
      </Card>
      {/* <div className="w-11/12 sm:w-96 pr-5 pl-5 bg-amber-300 rounded-md border-8">
        {user ? (
          <>
            <ExperienceBar />
            <h2 className="text-xl text-center font-semibold m-4">
              Ваші рецепти
            </h2>
            <ul className="list-disc m-6 flex flex-col">
              {Object.entries(recipes).map(([recipeId, recipe]) => (
                <li
                  key={recipeId}
                  className="flex items-center justify-between space-x-2 mb-2"
                >
                  <span className="mr-2">{recipe.name}</span>
                  <button
                    onClick={() => handleRecipeDelete(recipeId)}
                    className="bg-orange-500 text-white px-4 py-0 rounded-sm border-b-8 border-orange-600 mt-2 hover:bg-orange-800 active:border-b-0 active:py-3 transition-all ease-in-out"
                  >
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-gray-600">Увійдіть за допомогою Google акаунту</p>
        )}
      </div> */}
    </div>
  );
};

export default InfoList;
