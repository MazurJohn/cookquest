import React from "react";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
  Collapse,
  Badge,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
  BookOpenIcon,
  ListBulletIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { signInWithGoogle } from "./firebase";
import { signOutFunc } from "./firebase";
import { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import { ref, get, child, onValue } from "firebase/database";

// profile menu component
const profileMenuItems = [
  {
    label: "Мій профіль",
    icon: UserCircleIcon,
    link: "info",
  },
  {
    label: "Вихід",
    icon: PowerIcon,
    signOut: true,
  },
];

function ProfileMenu({ userphoto, username, userlevel }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto text-black"
        >
          <Avatar
            userphoto={userphoto}
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src={userphoto}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform text-black ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1 border-t-0 rounded-t-none bg-amber-400">
        <p className="pl-4 pb-2 pt-2 font-semibold text-black">
          {username} ({userlevel}-й lvl)
        </p>
        {profileMenuItems.map(({ label, icon, link, signOut }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          const onClickHandler = signOut ? signOutFunc : undefined;
          return (
            <Link to={link} key={label}>
              <MenuItem
                key={label}
                onClick={onClickHandler}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${
                    isLastItem ? "text-red-500" : "text-black"
                  }`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "black"}
                >
                  {label}
                </Typography>
              </MenuItem>
            </Link>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list component
const navListItems = [
  {
    label: "Книга рецептів",
    icon: BookOpenIcon,
    link: "recipe",
  },
  {
    label: "Список покупок",
    icon: ListBulletIcon,
    link: "shoppingList",
  },
  {
    label: "Додати рецепт",
    icon: PlusCircleIcon,
    link: "addRecipe",
  },
];

function NavList({ toggleNav }) {
  const [showShoppingListIndicator, setShowShoppingListIndicator] =
    useState(false);
  const [shoppingLength, setShoppingLength] = useState(0);
  const usersRef = ref(database, "user");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const shoppingListRef = child(usersRef, `${user.uid}/shoppingList`);
      const shoppingListUnsubscribe = onValue(shoppingListRef, (snapshot) => {
        const shoppingList = snapshot.val();
        if (shoppingList) {
          setShowShoppingListIndicator(true);
          setShoppingLength(shoppingList.length);
        } else {
          setShowShoppingListIndicator(false);
          setShoppingLength(0);
        }
      });
      return () => {
        shoppingListUnsubscribe();
      };
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, icon, link }, key) => (
        <Link to={link} key={label} onClick={toggleNav}>
          <Typography
            key={label}
            variant="small"
            color="black"
            className="font-normal text-lg"
          >
            {label === "Список покупок" ? (
              <MenuItem className="flex items-center gap-2 lg:rounded-full">
                <Badge
                  content={shoppingLength}
                  invisible={shoppingLength === 0 ? true : false}
                >
                  {React.createElement(icon, {
                    className: "h-[22px] w-[22px] mr-2",
                  })}{" "}
                  {label}
                </Badge>
              </MenuItem>
            ) : (
              <MenuItem className="flex items-center gap-2 lg:rounded-full">
                <Badge invisible={true}>
                  {React.createElement(icon, {
                    className: "h-[22px] w-[22px] mr-2",
                  })}{" "}
                  {label}
                </Badge>
              </MenuItem>
            )}
          </Typography>
        </Link>
      ))}
    </ul>
  );
}

export function ComplexNavbar({ userphoto, username, userlevel }) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [user, setUser] = useState(null);
  const [showShoppingListIndicator, setShowShoppingListIndicator] =
    useState(false);
  const [shoppingLength, setShoppingLength] = useState(0);
  const usersRef = ref(database, "user");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      const shoppingListRef = child(usersRef, `${user.uid}/shoppingList`);
      const shoppingListUnsubscribe = onValue(shoppingListRef, (snapshot) => {
        const shoppingList = snapshot.val();
        if (shoppingList) {
          setShowShoppingListIndicator(true);
          setShoppingLength(shoppingList.length);
        } else {
          setShowShoppingListIndicator(false);
          setShoppingLength(0);
        }
      });
      return () => {
        shoppingListUnsubscribe();
      };
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-full p-2 lg:pl-6 rounded-none rounded-b-2xl sm:rounded-b-none shadow-none bg-amber-500 border-none">
      <div className="relative mx-auto flex items-center text-blue-gray-900">
        <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-medium">
          <Link id="logo" className="text-3xl font-semibold" to="/cookquest">
            CookQuest
          </Link>
        </Typography>
        <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList />
        </div>
        <IconButton
          size="md"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Badge invisible={shoppingLength === 0 ? true : false}>
            <Bars2Icon className="h-6 w-6 text-black" />
          </Badge>
        </IconButton>
        {user ? (
          <ProfileMenu
            userphoto={user.photoURL}
            username={user.displayName}
            userlevel={userlevel}
          />
        ) : (
          <button className="sm:absolute sm:right-0" onClick={signInWithGoogle}>
            Увійти
          </button>
        )}
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList toggleNav={toggleIsNavOpen} />
      </Collapse>
    </Navbar>
  );
}
