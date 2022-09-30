const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);
var io = require("socket.io")(server);
const formatMessage = require("./utils/messages");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
const messages = [];

var clients = {};
const botName = "Some Bot";

app.use(express.json());
io.on("connection", (socket) => {
  console.log("connected with  flutter");
  socket.on("joinRoom", ({ username, room1, room2 }) => {
    console.log("room joined");
    console.log(username);
    console.log(room1);
    console.log(room2);

    // if (Number(room1) < Number(room2)) {

    const user = userJoin(socket.id, username, room1, room2);
    socket.join(user.room1, user.room2);

    // Welcome current user
    // !commented
    // socket.emit("message", formatMessage(botName, "Welcome to Chat Server"));

    // Broadcast when a user connects
    //! commented below
    // socket.broadcast
    //   .to(user.room1, user.room2)
    //   .emit(
    //     "message",
    //     formatMessage(botName, `${user.username} has joined the chat`)
    //   );

    // Send users and room info
    io.to(user.room1, user.room2).emit("roomUsers", {
      room1: user.room1,
      room2: user.room2,
      users: getRoomUsers(user.room1, user.room2),
    });
    // } else {
    //   console.log("hello from else part");
    //   let s = room1;
    //   room1 = room2;
    //   room2 = s;
    //   const user = userJoin(socket.id, username, room1, room2);
    //   socket.join(user.room1, user.room2);

    //   // Welcome current user
    //   socket.emit("message", formatMessage(botName, "Welcome to Chat Server"));

    //   // Broadcast when a user connects
    //   socket.broadcast
    //     .to(user.room1, user.room2)
    //     .emit(
    //       "message",
    //       formatMessage(botName, `${user.username} has joined the chat`)
    //     );

    //   // Send users and room info
    //   io.to(user.room1, user.room2).emit("roomUsers", {
    //     room1: user.room1,
    //     room2: user.room2,
    //     users: getRoomUsers(user.room1, user.room2),
    //   });
    // }
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    const user = getCurrentUser(socket.id);

    console.log(user.room1);
    console.log(user.room2);

    //! commented below line because it was sending to both the users........
    // io.to(user.room1, user.room2).emit(
    //   "message",
    //   formatMessage(user.username, msg)
    // );

    io.to(user.room2).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  // socket.on("disconnect", () => {
  //   const user = userLeave(socket.id);

  //   if (user) {
  //     io.to(user.room1, user.room2).emit(
  //       "message",
  //       formatMessage(botName, `${user.username} has left the chat`)
  //     );

  //     // Send users and room info
  //     io.to(user.room1, user.room2).emit("roomUsers", {
  //       room1: user.room1,
  //       room2: user.room2,
  //       users: getRoomUsers(user.room1, user.room2),
  //     });
  //   }
  // });
});

// ! mine ===>>>>>
// io.on("connection", (socket) => {
//   console.log("connected with flutter socket......");

//   socket.on("signin", (id) => {
//     console.log(id);
//     clients[id] = socket;
//   });

//   socket.on("message", (data) => {
//     const message = {
//       message: data.message,
//       senderUsername: data.sender,
//       sentAt: Date.now(),
//       senderId: data.receiverId,
//       receiverId: data.senderId,
//     };
//     messages.push(message);
//     let targetId = data.senderId;
//     if (clients[targetId]) clients[targetId].emit("message", message);
//   });
// });

app.get("/", (req, res) => {
  res.send("<h1>Hello Express! socket</h1>");
});

app.get("/home", (req, res) => {
  res.send("<h1>Hello Express! welcome to home</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1>Hello Express! welcome to about</h1>");
});
server.listen(process.env.PORT || 5000, () => {
  console.log("listening on*:5000");
});

// const express = require("express");
// var http = require("http");
// const app = express();
// const port = process.env.PORT || 3000;
// var server = http.createServer(app);
// var io = require("socket.io")(server);

// //middlewre
// app.use(express.json());
// var clients = {};

// io.on("connection", (socket) => {
//   console.log("connetetd");
//   console.log(socket.id, "has joined");
//   socket.on("signin", (id) => {
//     console.log(id);
//     clients[id] = socket;
//     console.log(clients);
//   });
//   socket.on("message", (msg) => {
//     console.log(msg);
//     let targetId = msg.targetId;
//     // if (clients[targetId])
//     console.log(clients)
//      clients[targetId].emit("message", msg);
//   });
// });

// server.listen(port, "0.0.0.0", () => {
//   console.log("server started");
// });
