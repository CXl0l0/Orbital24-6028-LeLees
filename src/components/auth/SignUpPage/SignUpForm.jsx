import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import logo from "../../images/urusai.png";
import { useState } from "react";
import { MdDeviceUnknown } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import HeaderIcon from "../../HeaderIcon";
import { auth, db } from "../../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
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
  const [signedUpAs, setSignedUpAs] = useState("");
  let samePassword = false;

  const signUp = (e) => {
    e.preventDefault();
    samePassword = newPasswordAgain === newPassword;
    if (samePassword) {
      createUserWithEmailAndPassword(auth, newEmail, newPassword)
        .then((userCredential) => {
          console.log(userCredential);
          sendEmailVerification(userCredential.user);
          console.log("Email verification sent!");
          setSendEmailVerificationLetter(true);
          addDoc(collection(db, "users"), {
            role: signedUpAs,
          }).catch((e) => console.log(e));
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
      <h1>Sign Up</h1>
      <form onSubmit={signUp}>
        Email <MdDeviceUnknown />
        <br />
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          ></input>
        </div>
        New Password <RiLockPasswordFill />
        <br />
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
        <div>
          <p>Signing up as:</p>
          <input
            type="radio"
            id="user"
            name="role"
            onChange={(e) => setSignedUpAs(e.target.id)}
            required
          />
          <label for="user">User</label>
          <input
            type="radio"
            id="administration"
            name="role"
            onChange={(e) => setSignedUpAs(e.target.id)}
          />
          <label for="administration">Administration</label>
        </div>
        <div>
          {signedUpAs === "administration" && (
            <p>
              Enter Administration ID
              <br />
              {
                <input
                  id="administrationID"
                  placeholder="Enter Administration ID"
                  type="text"
                  required
                ></input>
              }
            </p>
          )}
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
