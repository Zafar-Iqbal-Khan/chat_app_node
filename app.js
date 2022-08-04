const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);
var io = require("socket.io")(server);
const messages = [];

var clients={};

app.use(express.json());
io.on("connection", (socket) => {
  
  socket.on("signin", (id) => {
    console.log(id);
    clients[id] = socket;
  });

  socket.on("message", (data) => {
    const message = {
        message:data.message,
        senderUsername:data.sender,
        sentAt: Date.now(),
        senderId:data.receiverId,
        receiverId:data.senderId
        
    };
    messages.push(message);
    let targetId = data.senderId;
    if (clients[targetId])  clients[targetId].emit("message", message);
  
   
   
  });
});


app.get("/",(req,res)=>{
  res.status(200).json({msg:"hello world i am going to deploy my first node js app"});
})


server.listen(3000,"0.0.0.0",()=> {
  console.log("listening on*:3000");
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
