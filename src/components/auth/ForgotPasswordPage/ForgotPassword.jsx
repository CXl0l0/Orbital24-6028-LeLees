import logo from "../../images/urusai.png";
import "./ForgotPassword.css";
import React, { useState } from "react";
import { auth } from "../../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sentResetPassword, setSentResetPassword] = useState(false);
  const handleResetPassword = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSentResetPassword(true);
      })
      .catch((error) => console.log(error));
  };

  return sentResetPassword ? (
    <>
      <p>We've sent a reset password email to you!</p>
      <br />
      <a href="/">Login</a>
    </>
  ) : (
    <>
      <img src={logo} alt="urusai logo" width={150}></img>
      <h1>Reset your password</h1>
      <h4>Enter your email to reset your password</h4>
      <form onSubmit={handleResetPassword}>
        Email
        <br />
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <br />
        <button type="submit">Reset password</button>
      </form>
      <br />
      <a href="/">Login</a>
    </>
  );
};

export default ForgotPassword;
