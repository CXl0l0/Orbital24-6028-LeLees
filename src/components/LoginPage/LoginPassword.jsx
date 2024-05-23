import { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import HeaderIcon from "../HeaderIcon";

function showPassword() {
  let password = document.getElementById("passwordInput");

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

const LoginPassword = () => {
  const [password, setPassword] = useState("");

  return (
    <>
      <form>
        <div>
          Password <RiLockPasswordFill />
        </div>
        <div>
          <input
            placeholder="Enter Password"
            id="passwordInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <HeaderIcon
            inactiveIcon={<FaRegEyeSlash onClick={showPassword} />}
            activeIcon={<FaRegEye onClick={showPassword} />}
          />
        </div>
      </form>
    </>
  );
};

export default LoginPassword;
