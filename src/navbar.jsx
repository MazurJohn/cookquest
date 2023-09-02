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
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { signInWithGoogle } from "./firebase";
import { signOutFunc } from "./firebase";
import { useState, useEffect } from "react";
import { auth } from "./firebase";

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
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
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
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1 border-t-0 rounded-t-none">
        <span className="pl-4 font-semibold">
          {username} ({userlevel}-й lvl)
        </span>
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
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
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
    icon: UserCircleIcon,
    link: "recipe",
  },
  {
    label: "Список покупок",
    icon: CubeTransparentIcon,
    link: "shoppingList",
  },
  {
    label: "Додати рецепт",
    icon: CodeBracketSquareIcon,
    link: "addRecipe",
  },
];

function NavList() {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, icon, link }, key) => (
        <Link to={link} key={label}>
          <Typography
            key={label}
            variant="small"
            color="blue-gray"
            className="font-normal"
          >
            <MenuItem className="flex items-center gap-2 lg:rounded-full">
              {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
              {label}
            </MenuItem>
          </Typography>
        </Link>
      ))}
    </ul>
  );
}

export function ComplexNavbar({ userphoto, username, userlevel }) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Якщо користувач авторизований, то user буде не-null, інакше - null.
      setUser(user);
    });

    return () => {
      // Приберіть підписку на події при розмонтуванні компоненту.
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
    <Navbar className="mx-auto max-w-screen-xl p-2 lg:pl-6 rounded-none">
      <div className="relative mx-auto flex items-center text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
        >
          Material Tailwind
        </Typography>
        <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
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
        <NavList />
      </Collapse>
    </Navbar>
  );
}
