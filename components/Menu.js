import React from 'react';
import AppContext from "../context/AppContext";
import MenuIcon from "../public/images/menu_icon.svg";
import useToggle from "../hooks/useToggle";
import { logout } from "../lib/auth";
import Settings from "./Settings";
import Router from "next/router";

export default function Menu() {
  const appContext = React.useContext(AppContext);
  const { isActive: isOpened, toggle } = useToggle();

  const setOpened = () => {
    toggle();
  };

  return (
    <>
      <button type="button" className="friend-list__menu-action" onClick={setOpened} >
        <MenuIcon />
      </button>
      {isOpened &&
        <div className="side-menu">
          <div className="side-menu__header">
            <button type="button" className="friend-list__menu-action" onClick={setOpened} >
              <MenuIcon />
            </button>
            {(appContext.user && appContext.user.avatar) ?
              <img src={process.env.API_URL + '/' + appContext.user.avatar} alt="image" className="side-menu__image"/> :
              <img src="/images/placeholder.png" alt="image" className="side-menu__image"/> 
            }
            <p className="side-menu__name">
              {appContext.user && appContext.user.username}
            </p>
          </div>
          <div className="side-menu__container">
            <Settings />
            <button className="side-menu__some-action" onClick={() => { logout(); Router.push("/");}}>
              Log Out
            </button>
          </div>
        </div>
      }
    </>
  );
}