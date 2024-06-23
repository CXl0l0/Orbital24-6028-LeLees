//Tutorial from https://www.youtube.com/watch?v=7vVqMR96T5o
import { Server } from "socket.io";
import e from "express";
import { createServer } from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = e();
const server = createServer(app);
app.use(cors());
const PORT = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "build");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

function addNewUser(username, socketId) {
  //If there are no current users with the same username
  !onlineUsers.some((user) => user.username === username) &&
    //Then we add the new user into our onlineUsers
    onlineUsers.push({ username, socketId });
}

function removeUser(socketId) {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
}

function getUser(username) {
  return onlineUsers.find((user) => user.username === username);
}

io.on("connection", (socket) => {
  console.log("Connection detected");

  socket.on("newUser", (username) => {
    //When new user log in
    addNewUser(username, socket.id);
    console.log(onlineUsers);
  });

  socket.on("reportNotification", (clientName, receiverName, roomNum) => {
    console.log("received report from: " + clientName);
    const receiver = getUser(receiverName);
    if (receiver) {
      //Admin online
      console.log("Sending report to: " + receiverName);
      io.to(receiver.socketId).emit("getReport", {
        clientName,
        roomNum,
      });
    } else {
      //Handle admin offline situation
      console.log("Receiver not online at the moment");
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnection detected");
    removeUser(socket.id);
    console.log(onlineUsers);
  });
});

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    app.use(e.static(staticPath));
    const indexFile = path.join(__dirname, "build", "index.html");
    return res.sendFile(indexFile);
  });
}

server.listen(PORT, () => console.log("listening on port " + PORT));
