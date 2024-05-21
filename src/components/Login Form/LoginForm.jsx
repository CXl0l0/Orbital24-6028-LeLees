import LoginID from "./LoginID";
import test from "../images/urusai.png";

function LoginForm() {
  return (
    <>
      <img src={test} width={150}></img>
      <h3>Login</h3>
      <LoginID />
    </>
  );
}

export default LoginForm;
