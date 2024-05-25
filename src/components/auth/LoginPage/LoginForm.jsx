import logo from "../../images/urusai.png";
import "./LoginForm.css";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MdDeviceUnknown } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import HeaderIcon from "../../HeaderIcon";
import { auth } from "../../../firebase/firebase";
import { Navigate } from "react-router-dom";

function LoginForm() {
  function showPassword() {
    let password = document.getElementById("passwordInput");

    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

  const [userSignedIn, setUserSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .then(() => setUserSignedIn(true))
      .catch((error) => {
        console.log(error);
      });
  };

  return userSignedIn ? (
    <Navigate to="/home" />
  ) : (
    <>
      <img src={logo} alt="urusai logo" width={150}></img>
      <h1>Login</h1>
      <form onSubmit={signIn}>
        <div>
          Email <MdDeviceUnknown />
        </div>
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>

        <div>
          Password <RiLockPasswordFill />
        </div>
        <div>
          <input
            id="passwordInput"
            placeholder="Enter Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <HeaderIcon
            inactiveIcon={<FaRegEyeSlash onClick={showPassword} />}
            activeIcon={<FaRegEye onClick={showPassword} />}
          />
        </div>

        <button type="submit">Login</button>
      </form>
      <div>
        <p>
          New Account? <a href="/register">Register</a>
        </p>
      </div>
    </>
  );
}

export default LoginForm;
