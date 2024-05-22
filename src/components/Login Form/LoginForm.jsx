import LoginID from "./LoginID";
import logo from "../images/urusai.png";

function LoginForm() {
  return (
    <>
      <img src={logo} alt="urusai logo" width={150}></img>
      <h1>Login</h1>
      <LoginID />
    </>
  );
}

export default LoginForm;
