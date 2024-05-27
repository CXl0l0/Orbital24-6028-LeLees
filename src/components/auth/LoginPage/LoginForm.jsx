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
      <img src={logo} alt="urusai logo" width={150}></img>
      <h1>Login</h1>
      <form onSubmit={signIn}>
        Email <MdEmail />
        <br />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <br />
        Password <RiLockPasswordFill />
        <br />
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
        <br />
        <button type="submit">Login</button>
        {!error && userSignedIn && !verified && (
          <p className="userNotVerified">
            Your account hasn't been verified yet, please verify it first. Check
            you emails.
          </p>
        )}
        {error && (
          <p className="loginFailed">Login failed, wrong email or password!</p>
        )}
      </form>
      <div>
        New Account? <a href="/register">Register</a>
      </div>
    </>
  );
}

export default LoginForm;
