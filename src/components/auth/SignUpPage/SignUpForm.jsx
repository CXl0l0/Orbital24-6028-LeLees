import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import logo from "../../images/urusai.png";
import { setState, useState } from "react";
import { MdDeviceUnknown } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import HeaderIcon from "../../HeaderIcon";
import { auth } from "../../../firebase/firebase";
import "./SignUpForm.css";

const SignUpForm = () => {
  const showPassword = (id) => {
    let password = document.getElementById(id);

    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  const [sendEmailVerificationLetter, setSendEmailVerificationLetter] =
    useState(false);
  const [showAlert, setShowAlert] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [error, setError] = useState(null);
  let samePassword = false;

  const SignUp = (e) => {
    e.preventDefault();
    samePassword = newPasswordAgain === newPassword;
    if (samePassword) {
      createUserWithEmailAndPassword(auth, newEmail, newPassword)
        .then((userCredential) => {
          console.log(userCredential);
          sendEmailVerification(userCredential.user);
          console.log("Email verification sent!");
          setSendEmailVerificationLetter(true);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
        });
    } else {
      setShowAlert(
        "Please ensure that you had entered the same password again."
      );
    }
  };

  return sendEmailVerificationLetter ? (
    <p>
      We've sent you an email verification! Please check your email to verify
      your account. <a href="/">Login here</a>
    </p>
  ) : (
    <>
      <img src={logo} alt="urusai logo" width={150}></img>
      <h1>sign Up</h1>
      <form onSubmit={SignUp}>
        <div>
          Email <MdDeviceUnknown />
        </div>
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          ></input>
        </div>
        <div>
          New Password <RiLockPasswordFill />
        </div>
        <div>
          <input
            id="newPasswordInput"
            placeholder="Enter New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          ></input>
          <HeaderIcon
            inactiveIcon={
              <FaRegEyeSlash onClick={() => showPassword("newPasswordInput")} />
            }
            activeIcon={
              <FaRegEye onClick={() => showPassword("newPasswordInput")} />
            }
          />
        </div>
        <div>
          <input
            id="newPasswordInputAgain"
            placeholder="Enter New Password Again"
            type="password"
            onChange={(e) => setNewPasswordAgain(e.target.value)}
            required
          ></input>
          <HeaderIcon
            inactiveIcon={
              <FaRegEyeSlash
                onClick={() => showPassword("newPasswordInputAgain")}
              />
            }
            activeIcon={
              <FaRegEye onClick={() => showPassword("newPasswordInputAgain")} />
            }
          />
        </div>
        <button type="submit">Sign up</button>
        <br />
        {showAlert}
        {error && ( //might be other error, rmb to recode this section
          <p className="signUpError">
            The email provided is already registered as an account.
          </p>
        )}
      </form>
      <div>
        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </>
  );
};

export default SignUpForm;
