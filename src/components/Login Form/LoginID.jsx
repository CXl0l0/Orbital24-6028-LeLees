import { useState } from "react";

const LoginID = () => {
  const [deviceID, setDeviceID] = useState("Enter Device ID");
  const [password, setPassword] = useState("Enter Password");

  return (
    <>
      <div>
        Device ID
        <form>
          <input
            value={deviceID}
            onChange={(e) => setDeviceID(e.target.value)}
          ></input>
        </form>
      </div>
      <div>
        Password
        <form>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </form>
      </div>
      <div>
        <button>Login</button>
      </div>
    </>
  );
};

export default LoginID;
