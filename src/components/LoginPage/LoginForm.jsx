import LoginID from "./LoginID";
import logo from "../images/urusai.png";
import LoginPassword from "./LoginPassword";

function LoginForm() {
  return (
    <>
      <img src={logo} alt="urusai logo" width={150}></img>
      <h1>Login</h1>
      <LoginID />
      <LoginPassword />
      <div>
        <button type="submit">Login</button>
      </div>
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
}

export default LoginForm;
