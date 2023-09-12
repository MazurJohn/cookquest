import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, get, child, update } from "firebase/database";
import { auth, database } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import AlertDialog from "../dialog";

export default function AddRecipe() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Закуска");
  const [ingredients, setIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const openInfoDialog = () => {
    setInfoDialogOpen(true);
  };

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
  };

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

  const isAnyFieldEmpty =
    name === "" || ingredients === "" || description === "";

  return (
    <div className="relative flex flex-col items-center">
      <AlertDialog
        open={infoDialogOpen}
        onClose={closeInfoDialog}
        title="Зберегти рецепт?"
        content={`Додати рецепт ${name}?`}
        onConfirm={handleAddRecipe}
      />
      <Card className="w-11/12 sm:w-96 mt-10 z-0">
        <h1 className="text-2xl font-semibold m-4 text-center">
          Додати рецепт
        </h1>
        {user ? (
          <CardBody className="flex flex-col">
            <div className="mb-4">
              <Input
                label="Назва"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <select
                className="border border-blue-gray-200 w-full rounded-[7px] p-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Закуска">Закуска</option>
                <option value="Суп">Суп</option>
                <option value="Десерт">Десерт</option>
              </select>
            </div>
            <div className="mb-4">
              <p className="text-gray-400 text-center text-[12px]">
                Додавайте інгредієнти через кому: "цибуля, картопля, капуста"...
              </p>
              <Input
                label="Інгредієнти"
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Textarea
                label="Опис"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button
              className="self-center"
              color="green"
              onClick={openInfoDialog}
              disabled={isAnyFieldEmpty}
            >
              Зберегти рецепт
            </Button>
          </CardBody>
        ) : (
          <p className="text-gray-600 text-center p-5">
            Будь ласка, увійдіть, щоб додати рецепт
          </p>
        )}
      </Card>
    </div>
  );
}
