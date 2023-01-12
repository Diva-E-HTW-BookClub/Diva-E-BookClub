const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); 

const discussionMap = new Map();

var playingSateServer = [true, true];
var progressTimesServer= [0, 0];
var progressSumServer = -1;
var maxRoomSize = 0;
var currentRoom;
var roomSize

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        headers: {"Access-Control-Allow-Origin": "*"},
        //origin: "http://localhost:3000",
        origin: "*",
        methods: ["GET", "POST"],
    },
});

function createInMap(nameOfDiscussionId){
    discussionMap.set(nameOfDiscussionId, [[true, true],-1,-1,0]);
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
        currentRoom = data;
        console.log("numbers in room: "+ io.sockets.adapter.rooms.get(data).size)
        roomSize = io.sockets.adapter.rooms.get(data).size
        io.in(data).emit("changeParticipantCount", roomSize);
    });

    socket.on("send_playButton", (data) => {
        discussionMap.set(data.discussionId,[[data.emitStates], [discussionMap.get(data.discussionId)[1]],discussionMap.get(data.discussionId)[2],discussionMap.get(data.discussionId)[3]])
        playingSateServer = data;
        console.log(playingSateServer)
        io.in(data.discussionId).emit("receive_playButton", data)
    });

    socket.on("send_time", (data) => {
        discussionMap.set(data.discussionId,[[discussionMap.get(data.discussionId)[0]],[data.emitTimes] ,discussionMap.get(data.discussionId)[2]],discussionMap.get(data.discussionId)[3])
        progressTimesServer = data;
        console.log(progressTimesServer)
        io.in(data.discussionId).emit("receive_time", data)
    });

    socket.on("send_sum_time", (data) => {
        discussionMap.set(data.discussionId,[[discussionMap.get(data.discussionId)[0]], discussionMap.get(data.discussionId)[1], [data.emitSum],,discussionMap.get(data.discussionId)[3]])
        progressSumServer = data;
        console.log(progressSumServer)
        io.in(data.discussionId).emit("receive_sum_time", data)
    });

    socket.on("send_all_Data", (data) => {
        discussionMap.set(data.discussionId,[[data.emitStates], [discussionMap.get(data.discussionId)[1]],discussionMap.get(data.discussionId)[2],discussionMap.get(data.discussionId)[3]])
        playingSateServer = data.emitStates;

        discussionMap.set(data.discussionId,[[discussionMap.get(data.discussionId)[0]],[data.emitTimes] ,discussionMap.get(data.discussionId)[2],discussionMap.get(data.discussionId)[3]])
        progressTimesServer = data.emitTimes;

        discussionMap.set(data.discussionId,[[discussionMap.get(data.discussionId)[0]], discussionMap.get(data.discussionId)[1], [data.emitSum],discussionMap.get(data.discussionId)[3]])
        progressSumServer = data.emitSum;
        
        console.log("states:  "+ playingSateServer)
        console.log("timesServer: " + progressTimesServer)
        console.log("Sum: " + progressSumServer)

        // Update Synchronisation
        io.in(data.discussionId).emit("receive_playButton", data)
        io.in(data.discussionId).emit("receive_time", data)
        io.in(data.discussionId).emit("rreceive_sum_time", data)
        console.log(io.sockets.adapter.rooms.get(data.discussionId).size)
        io.in(data).emit("changeParticipantCount", io.sockets.adapter.rooms.get(data.discussionId).size);

    });
    socket.on("request_data", (data) => {
      
        if(progressSumServer != -1){
            console.log("state im loop SERVER " + discussionMap.get(data.discussionId)[0]);
            console.log("times im loop SERVER " + discussionMap.get(data.discussionId)[1]);
            console.log("sum im loop SERVER " + discussionMap.get(data.discussionId)[2]);

            io.in(data.discussionId).emit("receive_playButtonStart", discussionMap.get(data.discussionId)[0]);
            io.in(data.discussionId).emit("receive_timeStart", discussionMap.get(data.discussionId)[1]);
            io.in(data.discussionId).emit("receive_sum_timeStart", discussionMap.get(data.discussionId)[2]);

        }
    })

    socket.on("disconnect", () => {
        //var roomOfSocket = socket.rooms
        //var room =  Object.keys(socket.rooms).filter(item => item!=socket.id);
        
        console.log("Room of socket: " + currentRoom); // undefined
        var rommSizeAfterLeaving = roomSize -1;
        io.in(currentRoom).emit("changeParticipantCount", rommSizeAfterLeaving);
      });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});