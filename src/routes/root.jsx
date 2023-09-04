import { Outlet, Link, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, child, onValue } from "firebase/database";
import { auth, database } from "../firebase";
import { signInWithGoogle } from "../firebase";
import { signOutFunc } from "../firebase";
import AddRecipe from "./addRecipe";
import Admin from "./admin";
import ShoppingList from "./shoppingList";
import { ComplexNavbar } from "../navbar";

export default function Root({ missingIngredients }) {
  const [anonymous, setAnonymous] = useState(true);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [admin, setAdmin] = useState(false);
  const [showShoppingListIndicator, setShowShoppingListIndicator] =
    useState(false);
  const [shoppingLength, setShoppingLength] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
  const usersRef = ref(database, "user");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    // Відстеження змін стану аутентифікації
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Користувач увійшов в систему
        setAnonymous(false);
        console.log("User is login", user);
        get(child(usersRef, user.uid))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setUserName(userData.userName);
              setUserPhoto(userData.userPhoto);
              setUserLevel(userData.level);
              if (userData.isAdmin) {
                setAdmin(true);
              }
            }
          })
          .catch((error) => {
            console.error(error);
          });

        const shoppingListRef = child(usersRef, `${user.uid}/shoppingList`);
        const shoppingListUnsubscribe = onValue(shoppingListRef, (snapshot) => {
          const shoppingList = snapshot.val();
          if (shoppingList) {
            // Якщо список не пустий, показати індикатор
            setShowShoppingListIndicator(true);
            setShoppingLength(shoppingList.length);
          } else {
            // Якщо список пустий, приховати індикатор
            setShowShoppingListIndicator(false);
          }
        });
        return () => {
          shoppingListUnsubscribe();
        };
      } else {
        // Користувач вийшов з системи
        setAnonymous(true);
        console.log("User is anonymous");
      }
    });

    // Прибирання наглядача під час виходу з компоненту
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <ComplexNavbar
        userphoto={userPhoto}
        username={userName}
        userlevel={userLevel}
      />
      {/* <div className="flex bg-amber-400 flex-col sm:flex-row items-center justify-between overflow-x-hidden">
        <div className="flex flex-row justify-between items-center w-full">
          <Link to={`/cookquest`} className="logo p-3 relative">
            <span id="logo" className="text-4xl font-bold z-20 relative">
              CookQuest
            </span>
          </Link>
          <div className="sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-4 focus:outline-none"
            >
              {!isMobileMenuOpen ? (
                <img className="w-8 h-8" src={StateClosed} alt="BC" />
              ) : (
                <img className="w-8 h-8" src={StateOpen} alt="BO" />
              )}
            </button>
          </div>
        </div>

        <nav
          className={`${
            isMobileMenuOpen
              ? "block animate__fadeInRightBig"
              : "hidden animate__fadeOutLeftBig"
          } sm:flex sm:flex-row justify-end sm:w-full text-center leading-4 animate__animated`}
        >
          <ul className="flex flex-row text-center items-center text-sm leading-4">
            <li className="p-2">
              <Link to={`info`}>Інфо</Link>
            </li>
            <li className="p-2">
              <Link to={`recipe`}>Книга рецептів</Link>
            </li>
            <li className="p-2 relative">
              <Link
                to={`shoppingList`}
                onClick={() => {
                  setShowShoppingListIndicator(false);
                  setShoppingLength(0);
                }}
              >
              </Link>
            </li>
            <li className="p-2">
              <Link to={`addRecipe`}>Додати рецепт</Link>
            </li>
            <li className="p-2">
              {anonymous ? (
                <button onClick={signInWithGoogle}>Увійти з Google</button>
              ) : (
                <button onClick={signOutFunc}>Вийти</button>
              )}
            </li>
          </ul>
        </nav>
      </div> */}
      {/* {userName ? (
        <div className="flex flex-row justify-center bg-amber-300 pt-2 pb-1">
          {admin ? (
            <Link to={`admin`} className="mr-2">
              Admin
            </Link>
          ) : (
            <div></div>
          )}
          <p className="mr-2">{userName}</p>
          <img
            src={userPhoto}
            alt="userPhoto"
            className="rounded-full w-6 mr-5"
          />
          <ExperienceBar />
        </div>
      ) : (
        <div></div>
      )} */}
      <div id="detail" className="min-h-screen flex justify-center items-start">
        <Outlet />
      </div>
    </>
  );
}

<Route path="addRecipe" element={<AddRecipe />} />;
<Route path="admin" element={<Admin />} />;
<Route
  path="shoppingList"
  element={
    <ShoppingList
      onVisit={() => {
        setShowShoppingListIndicator(false);
        setShoppingLength(0);
      }}
    />
  }
/>;
