import React, { useEffect, useState } from "react";
import styles from "./iconsAuth0.module.css";
import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "universal-cookie";
import Alert from "../../components2/alert/alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../components2/loader/loader";

function IconsAuth0(props) {
  const { user, loginWithPopup, isAuthenticated, isLoading } = useAuth0();
  const cookie = new Cookies();
  const axiosUrl = process.env.REACT_APP_AXIOS_URL;
  const history = useNavigate();
  const [laoder, setLoader] = useState(false);

  useEffect(() => {
    if (props.Login) {
      if (isAuthenticated && user && laoder) {
        axios
          .post(axiosUrl + "/auth0/login", { email: user.email })
          .then((res) => {
            let callbackAlert = () => {
              cookie.set("username", res.data.username);
              cookie.set("email", res.data.email);
              setLoader(false);
              history("/");
              window.scroll(0, 0);
            };
            Alert(
              "Success!",
              "Has iniciado sesion correctamente",
              "success",
              callbackAlert
            );
          })
          .catch((err) => {
            setLoader(false);
            Alert("Error!", err.response.data, "error");
            history("/register-user");
          });
      } else {
        setLoader(false);
      }
    } else if (props.Register) {
      if (isAuthenticated && user && laoder) {
        axios
          .post(axiosUrl + "/auth0/register", {
            username: user.name,
            email: user.email,
            role: "user",
          })
          .then((res) => {
            setLoader(false);
            let callbackAlert = () => {
              history("/login");
              window.scroll(0, 0);
            };
            Alert("Success!", res.data, "success", callbackAlert);
          })
          .catch((err) => {
            setLoader(false);
            Alert("Error!", err.response.data, "error");
          });
      } else {
        setLoader(false);
      }
    }
  }, [isAuthenticated, isLoading, user]);

  if (props.Login) {
    const handleLoginClick = async () => {
      try {
        await loginWithPopup().then(() => {
          setLoader(true);
        });
      } catch (err) {
        Alert(
          "Error!",
          "Error al iniciar sesion por favor intente nuevamente",
          "error"
        );
      }
    };

    return (
      <div>
        {!laoder ? (
          <div className={styles.bodyIcons}>
            <div className={styles.containerIcons}>
              <div className={styles.boxIcon} onClick={handleLoginClick}>
                <AppleIcon
                  sx={{
                    color: "white",
                    width: "35px",
                    height: "35px",
                  }}
                />
              </div>

              <div className={styles.boxIcon} onClick={handleLoginClick}>
                <GoogleIcon
                  sx={{
                    color: "white",
                    width: "30px",
                    height: "30px",
                  }}
                />
              </div>
            </div>

            <div className={styles.lineIconContainer}>
              <div className={styles.lineIcon}></div>
              <PanoramaFishEyeIcon style={{ fill: "#ffffff", width: "15px" }} />
              <div className={styles.lineIcon}></div>
            </div>
          </div>
        ) : (
          <Loader Color="#7c16f5" Height="30px" Width="30px" />
        )}
      </div>
    );
  } else if (props.Register) {
    const handleRegisterClick = async () => {
      try {
        await loginWithPopup().then(() => {
          setLoader(true);
        });
      } catch (err) {
        Alert(
          "Error!",
          "Error al iniciar sesion por favor intente nuevamente",
          "error"
        );
      }
    };

    return (
      <div>
        {!laoder ? (
          <div className={styles.bodyIcons}>
            <div className={styles.containerIcons}>
              <div className={styles.boxIcon} onClick={handleRegisterClick}>
                <AppleIcon
                  sx={{
                    color: "white",
                    width: "35px",
                    height: "35px",
                  }}
                />
              </div>

              <div className={styles.boxIcon} onClick={handleRegisterClick}>
                <GoogleIcon
                  sx={{
                    color: "white",
                    width: "30px",
                    height: "30px",
                  }}
                />
              </div>
            </div>

            <div className={styles.lineIconContainer}>
              <div className={styles.lineIcon}></div>
              <PanoramaFishEyeIcon style={{ fill: "#ffffff", width: "15px" }} />
              <div className={styles.lineIcon}></div>
            </div>
          </div>
        ) : (
          <Loader Color="#7c16f5" Height="30px" Width="30px" />
        )}
      </div>
    );
  }
}

export default IconsAuth0;
