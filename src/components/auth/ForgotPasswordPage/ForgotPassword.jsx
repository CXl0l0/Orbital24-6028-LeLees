import logo from "../../images/urusai.png";
import "./ForgotPassword.css";
import React, { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { MdEmail } from "react-icons/md";

const ForgotPassword = () => {
  useEffect(() => {
    document.title = "Forgot Password";
  });

  const [email, setEmail] = useState("");
  const [sentResetPassword, setSentResetPassword] = useState(false);
  const [error, setError] = useState(false);
  const handleResetPassword = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSentResetPassword(true);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };

  return sentResetPassword ? (
    <>
      <div className="sentResetPassword">
        <p>We've sent a reset password email to you! </p>
        <a href="/">Login</a>
      </div>
    </>
  ) : (
    <>
      <body className="forgotPasswordBody">
        <img className="logo" src={logo} alt="urusai logo" width={300}></img>
        <div className="forgot-password-wrapper">
          <h1>Reset your password</h1>
          <h4>Enter your email to reset your password</h4>
          <form onSubmit={handleResetPassword}>
            <div className="forgot-password-input-box">
              Email <MdEmail />
              <br />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
              <br />
              <button type="submit">Reset password</button>
              <br />
              {error && (
                <p className="reset-password-error">
                  Please enter a valid email.
                </p>
              )}
            </div>
          </form>
          <br />
          <a className="forgot-password-login" href="/">
            Login
          </a>
        </div>
      </body>
    </>
  );
};

export default ForgotPassword;
