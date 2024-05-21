import { getElementError } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { click } from "@testing-library/user-event/dist/click";
import { useState } from "react";

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
      <div>
        Device ID
        <form>
          <input
            id="deviceIdForm"
            value={deviceID}
            onChange={(e) => setDeviceID(e.target.value)}
          ></input>
        </form>
      </div>
      <div>
        Password
        <form>
          <input
            id="passwordInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <input type="checkbox" onClick={showPassword}></input> Show Password
        </form>
      </div>
      <div>
        <button>Login</button>
      </div>
    </>
  );
};

export default LoginID;
