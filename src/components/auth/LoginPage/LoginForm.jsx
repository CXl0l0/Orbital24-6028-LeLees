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
              Email <MdEmail className="icon" />
              <br />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
              <br />
              <br />
              Password <RiLockPasswordFill className="icon" />
              <br />
              <input
                id="passwordInput"
                placeholder="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
              <i>
                <HeaderIcon
                  inactiveIcon={<FaRegEyeSlash onClick={showPassword} />}
                  activeIcon={<FaRegEye onClick={showPassword} />}
                />
              </i>
            </div>
            <br />
            <button type="submit">Login</button> <br />
            <a className="forgotPassword" href="/forgotpassword">
              Forgot password?
            </a>
            {!error && userSignedIn && !verified && (
              <p className="userNotVerified">
                Your account hasn't been verified yet, please verify it first.
                Check you emails.
              </p>
            )}
            {error && (
              <p className="loginFailed">
                Login failed, wrong email or password!
              </p>
            )}
          </form>
          Don't have an account? <a href="/register">Register</a>
        </div>
      </body>
    </>
  );
}

export default LoginForm;
