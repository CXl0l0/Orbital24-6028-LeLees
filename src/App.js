import { useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import LoginForm from "./components/auth/LoginPage/LoginForm";

function App() {
  useEffect(() => {
    const URL =
      process.env.NODE_ENV === "production" ? undefined : "ws://localhost:8000";
    const socket = io(URL, {
      autoConnect: false,
      transports: ["websocket"],
    });
  }, []);

  return (
    <div>
      <LoginForm />
    </div>
  );
}

export default App;
