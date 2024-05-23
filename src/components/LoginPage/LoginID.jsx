import { useState } from "react";
import { MdDeviceUnknown } from "react-icons/md";

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
      </form>
    </>
  );
};

export default LoginID;
