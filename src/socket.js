import { io } from "socket.io-client";

const URL =
  process.env.NODE_ENV === "production"
    ? "https://vercel.com/cxl0l0s-projects/orbital24-6028-le-lees/4uu1ahaJWFcojzAg7jmi2Gp3Kzye"
    : "ws://localhost:8000";

export const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});
