import { useContext } from "react";
import { ModalContext } from "../App";

function Register() {
  const { modal,setModal,generateRandom} = useContext(ModalContext);

  const validateOtp = () => {
    // checking for null values required because type defined
    if (setModal !== null) {
      setModal({ ...modal,isOpen: true, otp: generateRandom()});
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <button className="btn btn--primary" onClick={validateOtp}>
        Validate OTP
      </button>
    </div>
  );
}

export default Register;
