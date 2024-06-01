import logo from "../../images/urusai.png";
import "./LoginForm.css";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import HeaderIcon from "../../HeaderIcon";
import { auth } from "../../../firebase/firebase";
import { Navigate } from "react-router-dom";
import "./LoginForm.css";
import React from "react";

function LoginForm() {
  function showPassword() {
    let password = document.getElementById("passwordInput");

    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

  const [verified, setVerified] = useState(false);
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .then(() => {
        setError(false);
        setVerified(auth.currentUser.emailVerified);
        console.log(auth.currentUser.email);
        console.log(auth.currentUser.emailVerified);
        setUserSignedIn(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  };

  return userSignedIn && verified ? (
    <Navigate to="/home" />
  ) : (
    <>
      <body className="loginBody">
        <img className="logo" src={logo} alt="urusai logo" width={300}></img>
        <div className="wrapper">
          <h1>Login</h1>
          <br />
          <form onSubmit={signIn}>
            <div className="input-box">
              <span>
                Email <MdEmail className="icon" />
              </span>
              <br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
              ></input>
              <br />
              <span>
                Password <RiLockPasswordFill className="icon" />
              </span>
              <br />
              <input
                id="passwordInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                required
              ></input>
              <i>
                <HeaderIcon
                  inactiveIcon={<FaRegEyeSlash onClick={showPassword} />}
                  activeIcon={<FaRegEye onClick={showPassword} />}
                />
              </i>
            </div>
            <a className="forgotPassword" href="/forgotpassword">
              Forgot password?
            </a>
            <br />
            <button type="submit">Login</button> <br />
            {!error && userSignedIn && !verified && (
              <p className="userNotVerified">Please verify your email first.</p>
            )}
          </form>
          {error && (
            <p className="loginFailed">Login failed, please try again.</p>
          )}
          Don't have an account?{" "}
          <a className="register" href="/register">
            Register
          </a>
        </div>
      </body>
    </>
  );
}

export default LoginForm;
