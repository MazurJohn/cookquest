import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex items-center justify-center animate__animated animate__fadeInUp">
      <div className="bg-white mt-10 p-10 rounded-lg">
        <h1 className="text-3xl font-semibold mb-6">
          Ласкаво просимо до CookQuest!
        </h1>
        <p className="text-gray-600 mb-8">
          Пошук рецептів за наявними інгредієнтами та багато іншого!
        </p>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="bg-blue-500 text-white p-6 rounded-md border-8 relative">
            <img
              src="src/assets/Spaghetti.png"
              alt="Spaghetti"
              className="absolute w-24 h-24 -right-3 -top-10 animate__animated animate__pulse animate__slower animate__infinite"
            />
            <h2 className="text-xl font-semibold mb-4">Пошук рецептів</h2>
            <p className="text-gray-100 mb-4">
              Знайдіть рецепти, використовуючи інгредієнти, які ви маєте.
            </p>
            <Link
              to="recipe"
              className="block bg-blue-700 py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Перейти до рецептів
            </Link>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-md border-8 relative">
            <img
              src="src/assets/Donut.png"
              alt="Donut"
              className="absolute w-20 h-20 -right-3 -top-5 animate__animated animate__pulse animate__slower animate__infinite animate__delay-2s"
            />
            <h2 className="text-xl font-semibold mb-4">Список покупок</h2>
            <p className="text-gray-100 mb-4">
              Автоматично додавайте інгредієнти з рецептів до списку покупок.
            </p>
            <Link
              to="shoppingList"
              className="block bg-green-700 py-2 px-4 rounded-md hover:bg-green-600"
            >
              Перейти до списку покупок
            </Link>
          </div>
        </div>
        <p className="text-center mt-8">
          Поділіться своїм рівнем майстерності, створюючи та додаючи нові
          рецепти!
        </p>
      </div>
    </div>
  );
}
