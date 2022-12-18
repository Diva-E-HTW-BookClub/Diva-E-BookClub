const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); 

var progressTimesServer= [0, 0];
var playingSateServer = [false, false];
var progressSumServer = 0;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:8101",
        methods: ["GET", "POST"],
    },
});


io.on("connection", (socket) => {
    //console.log(`User Connected: ${socket.id}`);
    //console.log(`test: ${socket.id}`);
    var arrayProgress = Object.values(progressTimesServer)[0]
    var arrayStates = Object.values(playingSateServer)[0];
    socket.emit("progressEmit", (arrayProgress))
    socket.emit("statesEmit", (arrayStates))
    socket.emit("sumEmit", (progressSumServer))
    
    socket.on("send_playButton", (data) => {
        playingSateServer = data;
        //console.log(playingSateServer)
        socket.emit("receive_playButton", data);
        socket.broadcast.emit("receive_playButton", data);
    });
    socket.on("send_time", (data) => {
        progressTimesServer = data;
        //console.log(progressTimesServer)
        socket.emit("receive_time", data);
        socket.broadcast.emit("receive_time", data);
    });
    socket.on("send_sum_time", (data) => {
        progressSumServer = data;
        //console.log(progressSumServer)
        socket.emit("receive_sum_time", data);
        socket.broadcast.emit("receive_sum_time", data);
    });
    socket.on("send_all_Data", (data) => {
        playingSateServer = data.playingState;
        progressTimesServer = data.progressTimesForServer;
        progressSumServer = data.progressSumForServer;
        console.log("states:  "+ playingSateServer)
        console.log("timesServer: " + progressTimesServer)
        console.log("Sum: " + progressSumServer)
    });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});