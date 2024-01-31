import Swal from "sweetalert2";

const Alert = (Tittle, Text, Icon, callback) => {
  Swal.fire({
    title: Tittle,
    text: Text,
    icon: Icon,
    confirmButtonText: "Ok",
  }).then(() => {
    if (callback) {
      const nextAction = () => {
        callback();
      };
      nextAction();
    } else {
      return null;
    }
  });
};

export default Alert;
