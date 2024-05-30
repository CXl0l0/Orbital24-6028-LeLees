import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import logo from "../../images/urusai.png";
import { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import HeaderIcon from "../../HeaderIcon";
import { auth, db } from "../../../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./SignUpForm.css";

const SignUpForm = () => {
  useEffect(() => {
    document.title = "Sign Up urusai!";
  });

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
  const [userName, setUserName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [error, setError] = useState(null);
  const [signedUpAs, setSignedUpAs] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminId, setAdminId] = useState("");
  let samePassword = false;

  const signUp = (e) => {
    e.preventDefault();
    setShowAlert("");
    setError(false);
    samePassword = newPasswordAgain === newPassword;
    if (samePassword) {
      if (signedUpAs === "user") {
        //if signed up as user
        //Create new account straight away
        createUserWithEmailAndPassword(auth, newEmail, newPassword)
          .then((userCredential) => {
            console.log(userCredential);
            updateProfile(userCredential.user, {
              displayName: userName,
            });
            //Add new document for user
            setDoc(doc(db, "accounts", userCredential.user.uid), {
              username: userName,
              role: signedUpAs,
            }).catch((e) => console.log(e));
            //Finally, send email verification
            sendEmailVerification(userCredential.user);
            console.log("Email verification sent!");
            setSendEmailVerificationLetter(true);
          })
          .catch((error) => {
            //in case error thrown when creating acc
            console.log(error);
            setError(error);
          });
      } else if (signedUpAs === "administration") {
        //if signed up as admin, check administration id
        const adminRef = doc(db, "adminids", adminName);
        getDoc(adminRef).then((adminSnap) => {
          if (adminSnap.exists()) {
            const dbid = adminSnap.data().id;
            console.log(dbid);
            dbid === adminId
              ? createUserWithEmailAndPassword(auth, newEmail, newPassword)
                  .then((userCredential) => {
                    console.log(userCredential);
                    updateProfile(userCredential.user, {
                      displayName: userName,
                    });
                    setDoc(doc(db, "accounts", userCredential.user.uid), {
                      username: userName,
                      id: adminId,
                      role: signedUpAs,
                    }).catch((e) => console.log(e));

                    sendEmailVerification(userCredential.user);
                    console.log("Email verification sent!");
                    setSendEmailVerificationLetter(true);
                  })
                  .catch((error) => {
                    console.log(error);
                    setError(error);
                  })
              : console.log("incorrect admin id entered");
            setShowAlert(
              "Please ensure you've entered the correct administrataion ID."
            );
          } else {
            console.log("No admin with entered adminName found in db");
            setShowAlert(
              "Please ensure you've entered the correct administration name."
            );
          }
        });
      }
    } else {
      setShowAlert("Please ensure that you have entered the same password.");
    }
  };

  return sendEmailVerificationLetter ? (
    <p className="emailLetter">
      We've sent you an email verification! Please check your email to verify
      your account.
      <div>
        <a href="/">Login here</a>
      </div>
    </p>
  ) : (
    <>
      <body className="signupBody">
        <img className="logo" src={logo} alt="urusai logo" width={300}></img>
        <div className="signup-wrapper">
          <h1>Sign Up</h1>
          <form onSubmit={signUp}>
            <div className="signup-input-box">
              Username <FaUser />
              <br />
              <input
                type="text"
                placeholder="Enter Your Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <br />
              Email <MdEmail />
              <br />
              <input
                type="email"
                placeholder="Enter Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <div>
                New Password <RiLockPasswordFill />
                <br />
                <input
                  id="newPasswordInput"
                  placeholder="Enter New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <i>
                  <HeaderIcon
                    inactiveIcon={
                      <FaRegEyeSlash
                        onClick={() => showPassword("newPasswordInput")}
                      />
                    }
                    activeIcon={
                      <FaRegEye
                        onClick={() => showPassword("newPasswordInput")}
                      />
                    }
                  />
                </i>
                <input
                  id="newPasswordInputAgain"
                  placeholder="Enter New Password Again"
                  type="password"
                  onChange={(e) => setNewPasswordAgain(e.target.value)}
                  required
                />
                <i>
                  <HeaderIcon
                    inactiveIcon={
                      <FaRegEyeSlash
                        onClick={() => showPassword("newPasswordInputAgain")}
                      />
                    }
                    activeIcon={
                      <FaRegEye
                        onClick={() => showPassword("newPasswordInputAgain")}
                      />
                    }
                  />
                </i>
              </div>
              <div className="signupAs">
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
                {signedUpAs === "administration" && (
                  <div className="signup-administration">
                    <p>
                      Enter Administration Name
                      <br />
                      <input
                        id="administrationName"
                        placeholder="Enter Administration Name"
                        type="text"
                        onChange={(e) => setAdminName(e.target.value)}
                        required
                      ></input>
                      <br />
                      Enter Administration ID
                      <br />
                      <input
                        id="administrationID"
                        placeholder="Enter Administration ID"
                        type="text"
                        onChange={(e) => setAdminId(e.target.value)}
                        required
                      ></input>
                    </p>
                  </div>
                )}
              </div>
              <button type="submit">Sign up</button>
              <br />
              <p className="showAlert">{showAlert}</p>
              {error && ( //might be other error, rmb to recode this section
                <p className="signUpError">
                  The email provided is already registered as an account.
                </p>
              )}
            </div>
          </form>
          <div>
            <p>
              Already have an account?{" "}
              <a className="signup-login" href="/">
                Login
              </a>
            </p>
          </div>
        </div>
      </body>
    </>
  );
};

export default SignUpForm;
