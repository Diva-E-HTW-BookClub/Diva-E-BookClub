const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); 

const discussionMap = new Map();

var playingSateServer = [true, true];
var progressTimesServer= [0, 0];
var progressSumServer = -1;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

function createInMap(nameOfDiscussionId){
    discussionMap.set(nameOfDiscussionId, [[true, true],-1,-1]);
}


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    
    socket.on("join_discussion_room", (data) => {
        if(!(discussionMap.has(data))){
            createInMap(data)
        }
        console.log(discussionMap.get(data)[0]);
        console.log(discussionMap.get(data))
        socket.join(data);
    });

    socket.on("send_playButton", (data) => {
        discussionMap.set(data.discussionId,[[data.emitStates], [discussionMap.get(data.discussionId)[1]],discussionMap.get(data.discussionId)[2]])
        playingSateServer = data;
        console.log(playingSateServer)
        console.log("HIER SCHAU MAL" + discussionMap.get(data.discussionId)[0])
        io.in(data.discussionId).emit("receive_playButton", data)
    });

    socket.on("send_time", (data) => {
        discussionMap.set(data.discussionId,[[discussionMap.get(data.discussionId)[0]],[data.emitTimes] ,discussionMap.get(data.discussionId)[2]])
        progressTimesServer = data;
        console.log(progressTimesServer)
        io.in(data.discussionId).emit("receive_time", data)
    });

    socket.on("send_sum_time", (data) => {
        discussionMap.set(data.discussionId,[[discussionMap.get(data.discussionId)[0]], discussionMap.get(data.discussionId)[1], [data.emitSum]])
        progressSumServer = data;
        console.log(progressSumServer)
        io.in(data.discussionId).emit("receive_sum_time", data)
    });

    socket.on("send_all_Data", (data) => {
        discussionMap.set(data.discussionId,[[data.emitStates], [discussionMap.get(data.discussionId)[1]],discussionMap.get(data.discussionId)[2]])
        playingSateServer = data.emitStates;

        discussionMap.set(data.discussionId,[[discussionMap.get(data.discussionId)[0]],[data.emitTimes] ,discussionMap.get(data.discussionId)[2]])
        progressTimesServer = data.emitTimes;

        discussionMap.set(data.discussionId,[[discussionMap.get(data.discussionId)[0]], discussionMap.get(data.discussionId)[1], [data.emitSum]])
        progressSumServer = data.emitSum;
        
        console.log("states:  "+ playingSateServer)
        console.log("timesServer: " + progressTimesServer)
        console.log("Sum: " + progressSumServer)

        // Update Synchronisation
        io.in(data.discussionId).emit("receive_playButton", data)
        io.in(data.discussionId).emit("receive_time", data)
        io.in(data.discussionId).emit("rreceive_sum_time", data)

    });
    socket.on("request_data", (data) => {
      
        if(progressSumServer != -1){
            console.log("state im loop: " + playingSateServer)
            console.log("times im loop: " + progressTimesServer)
            console.log("sum im loop: " + progressSumServer)

            console.log("state im loop SERVER" + discussionMap.get(data.discussionId)[0]);
            console.log("times im loop SERVER" + discussionMap.get(data.discussionId)[1]);
            console.log("sum im loop SERVER" + discussionMap.get(data.discussionId)[2]);

            io.in(data.discussionId).emit("receive_playButtonStart", discussionMap.get(data.discussionId)[0]);
            io.in(data.discussionId).emit("receive_timeStart", discussionMap.get(data.discussionId)[1]);
            io.in(data.discussionId).emit("receive_sum_timeStart", discussionMap.get(data.discussionId)[2]);

        }
    })
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});