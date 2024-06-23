import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://master.dnb6ycggt35yz.amplifyapp.com/"
    : "ws://localhost:8000";

export const socket = io("https://master.dnb6ycggt35yz.amplifyapp.com/", {
  autoConnect: false,
  transports: ["websocket"],
});
