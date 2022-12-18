const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); 


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});





io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    console.log(`test: ${socket.id}`);
    //socket.broadcast.emit("testEmit", "test")
    

    socket.on("send_message", (data) => {
        socket.emit("receive_message", data);
        socket.broadcast.emit("receive_message", data);
    });
    socket.on("send_playButton", (data) => {
        socket.emit("receive_playButton", data);
        socket.broadcast.emit("receive_playButton", data);
    });
    socket.on("send_time", (data) => {
        socket.emit("receive_time", data);
        socket.broadcast.emit("receive_time", data);
    });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});