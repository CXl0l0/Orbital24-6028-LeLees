//Tutorial from https://www.youtube.com/watch?v=7vVqMR96T5o
import { Server } from "socket.io";
import e from "express";
import { createServer } from "http";
import cors from "cors";

const app = e();
const server = createServer(app);
app.use(cors);

const io = new Server(server, {
  cors: {
    origin:
      "[http://localhost:8080, https://master.dnb6ycggt35yz.amplifyapp.com/]",
    methods: ["GET", "POST"],
  },
});
const PORT = process.env.PORT || 8000;
console.log(PORT);

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

  socket.on("reportNotification", (clientName, receiverName) => {
    console.log("received report from: " + clientName);
    const receiver = getUser(receiverName);
    if (receiver) {
      //Admin online
      console.log("Sending report to: " + receiverName);
      io.to(receiver.socketId).emit("getReport", {
        clientName,
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

server.listen(PORT, () => console.log("listening on port 8000"));
