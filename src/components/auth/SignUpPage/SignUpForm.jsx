import { createUserWithEmailAndPassword } from "firebase/auth";
import logo from "../../images/urusai.png";
import { useState } from "react";
import { MdDeviceUnknown } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import HeaderIcon from "../../HeaderIcon";
import { auth } from "../../../firebase/firebase";

const SignUpForm = () => {
  function showPassword() {
    let password = document.getElementById("newPasswordInput");

    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  }

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, newEmail, newPassword)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
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
