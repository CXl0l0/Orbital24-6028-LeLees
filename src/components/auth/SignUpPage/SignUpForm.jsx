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
import { auth } from "../../../firebase/firebase";
import "./SignUpForm.css";

const SignUpForm = () => {
  function showPassword() {
    let password = document.getElementById("newPasswordInput");

    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

  const [sendEmailVerificationLetter, setSendEmailVerificationLetter] =
    useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);

  const signUp = (e) => {
    e.preventDefault();
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
        <div>
          Email <MdDeviceUnknown />
        </div>
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
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
          ></input>
          <HeaderIcon
            inactiveIcon={<FaRegEyeSlash onClick={showPassword} />}
            activeIcon={<FaRegEye onClick={showPassword} />}
          />
        </div>

        <button type="submit">Sign up</button>
        {error && ( //might be other error, rmb to recode this section
          <p className="signUpError">
            The email provided is already registered!
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
