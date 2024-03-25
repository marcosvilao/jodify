import React from "react";
import HandymanIcon from "@mui/icons-material/Handyman";
import styles from "./updatingPage.module.css";

function UpadatingPage() {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <HandymanIcon className={styles.icon} />
        <h1 className={styles.h1Repeair}>
          Estamos relizando tareas de mantenmiento por favor ingresar nuevamente
          en unos minutos
        </h1>

        <h3 className={styles.h3Repeair}>Disculpe las molestias</h3>
      </div>
    </div>
  );
}

export default UpadatingPage;
