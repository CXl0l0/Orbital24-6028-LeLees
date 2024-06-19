//Tutorial from https://www.youtube.com/watch?v=7vVqMR96T5o
import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
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
    addNewUser(username, socket.id);
    console.log(onlineUsers);
  });

  socket.on("disconnect", () => {
    console.log("Disconnection detected");
    removeUser(socket.id);
    console.log(onlineUsers);
  });
});

io.listen(5000);
