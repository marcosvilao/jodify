import React, { useState } from "react";
import styles from "./header.module.css";
import logo from "../../logo-jodify/JODIFY_Iso_Gradient.svg";
import theme from "../../jodifyStyles";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

function Header() {
  const [stateMenu, setStateMenu] = useState(false);
  const [stateOpenCloseMenu, setStateOpenCloseMenu] = useState(false);

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

  return (
    <div className={styles.body}>
      <div className={styles.containerLeft}>
        <img
          style={{ borderRadius: theme.jodify_borders._lg_border_radius }}
          width="40px"
          height="40px"
          src={logo}
          alt="error al cargar el logo"
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

      <div className={styles.menu} id="menu">
        <div className={styles.userProductora}>
          <Link
            className={styles.linkMenu}
            to={"/register-user"}
            onClick={onClickLink}
          >
            Registrarse
          </Link>
          <Link className={styles.linkMenu} to={"/login"} onClick={onClickLink}>
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
    </div>
  );
}

export default Header;
