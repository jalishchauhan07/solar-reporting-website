/* eslint-disable react/prop-types */
import styles from "./menu.module.css";
import dashboard from "../../../assets/dashboard_white_24dp.svg";
import logout from "../../../assets/power_settings_new_white_24dp.svg";
import project from "../../../assets/pending_actions_white_24dp.svg";
import user from "../../../assets/portrait_white_24dp.svg";
import menu from "../../../assets/menu_white_24dp.svg";
import { useState } from "react";

export default function Menu({ setModule }) {
  const [hover, setHover] = useState();
  console.log(setModule);
  function MouseEnter() {
    document.getElementById("sidebar").style.width = "15rem";
    setHover(true);
  }
  function MouseOut() {
    document.getElementById("sidebar").style.width = "10rem";
    setHover(false);
  }
  return (
    <div className={styles.sidebar} id="sidebar">
      <nav
        className={styles.nav}
        onMouseEnter={MouseEnter}
        onMouseLeave={MouseOut}
      >
        <ul className={styles.menu}>
          <li>
            <img src={menu} style={{ display: hover ? "none" : "" }} />
          </li>
          <li>
            <img src={dashboard} />
            <a href="#" style={{ display: hover ? "flex" : "none" }}>
              Dashboard
            </a>
          </li>
          <li
            onClick={() => {
              alert("click");

              setModule(1);
            }}
          >
            <img src={project} />
            <a href="#" style={{ display: hover ? "flex" : "none" }}>
              Projects
            </a>
          </li>
          <li
            onClick={() => {
              alert("click");
              setModule(2);
            }}
          >
            <img src={user} />
            <a href="#" style={{ display: hover ? "flex" : "none" }}>
              User
            </a>
          </li>
          <li
            onClick={() => {
              alert("click");
              setModule(3);
            }}
          >
            <img src={logout} />
            <a href="#" style={{ display: hover ? "flex" : "none" }}>
              logout
            </a>
          </li>
          <li></li>
        </ul>
      </nav>
    </div>
  );
}
