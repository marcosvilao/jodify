import React, { useState } from "react";
import styles from "./header.module.css";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import theme from "../../jodifyStyles";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Header() {
  const cookie = new Cookies();
  const cookieName = cookie.get("username");

  const [stateMenu, setStateMenu] = useState(false);
  const [stateOpenCloseMenu, setStateOpenCloseMenu] = useState(false);
  const history = useNavigate();

  const onClickMenu = () => {
    const menu = document.getElementById("menu");

    if (stateMenu === false) {
      menu.style.display = "flex";
      setStateMenu(true);
      setStateOpenCloseMenu(true);
    } else {
      menu.style.display = "none";
      setStateMenu(false);
      setStateOpenCloseMenu(false);
    }
  };

  const onClickLink = () => {
    const menu = document.getElementById("menu");
    menu.style.display = "none";
    setStateMenu(false);
    setStateOpenCloseMenu(false);
  };

  const onClickRouteHome = () => {
    history("/");
    window.scroll(0, 0);
  };

  const logOut = () => {
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/";
  };

  return (
    <div className={styles.body}>
      <div className={styles.containerLeft}>
        <img
          style={{
            borderRadius: theme.jodify_borders._lg_border_radius,
            cursor: "pointer",
          }}
          width="40px"
          height="40px"
          src={logo}
          alt="error al cargar el logo"
          onClick={onClickRouteHome}
        />
      </div>

      <div className={styles.containerRigth}>
        {stateOpenCloseMenu === false ? (
          <MenuIcon
            sx={{
              color: "white",
              cursor: "pointer",
              width: "30px",
              height: "30px",
            }}
            onClick={onClickMenu}
          />
        ) : (
          <CloseIcon
            sx={{
              color: "white",
              cursor: "pointer",
              width: "30px",
              height: "30px",
            }}
            onClick={onClickMenu}
          />
        )}

        <PersonIcon
          sx={{
            color: "white",
            cursor: "pointer",
            width: "30px",
            height: "30px",
          }}
          onClick={onClickMenu}
        />
      </div>

      {!cookieName ? (
        <div className={styles.menu} id="menu">
          <div className={styles.userProductora}>
            <Link
              className={styles.linkMenu}
              to={"/register-user"}
              onClick={onClickLink}
            >
              Registrarse
            </Link>
            <Link
              className={styles.linkMenu}
              to={"/login"}
              onClick={onClickLink}
            >
              Iniciar Sesion
            </Link>
          </div>

          <div className={styles.userProductora}>
            <Link
              className={styles.linkMenu}
              to={"/productora-welcome"}
              onClick={onClickLink}
            >
              Productora
            </Link>
          </div>

          <div className={styles.userProductora}>
            <Link className={styles.linkMenu} to={"/"} onClick={onClickLink}>
              Inicio
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.menu} id="menu" style={{ height: "90px" }}>
          <div className={styles.userProductora}>
            <Link
              className={styles.linkMenu}
              to={"/profile"}
              onClick={onClickLink}
            >
              Mi Perfil
            </Link>
            <button className={styles.buttonLogout} onClick={logOut}>
              Cerrar Sesion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
