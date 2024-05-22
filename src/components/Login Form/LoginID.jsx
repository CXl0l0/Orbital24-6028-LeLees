import { useState } from "react";
import { MdDeviceUnknown } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

function showPassword() {
  let password = document.getElementById("passwordInput");

  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
}

const LoginID = () => {
  const [deviceID, setDeviceID] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <form>
        <div>
          Device ID <MdDeviceUnknown />
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter Device ID"
            id="deviceIdForm"
            value={deviceID}
            onChange={(e) => setDeviceID(e.target.value)}
          ></input>
        </div>
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
          <input type="checkbox" onClick={showPassword}></input> Show Password
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      <div>
        <p>
          New Device?{" "}
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D">
            Register
          </a>
        </p>
      </div>
    </>
  );
};

export default LoginID;
