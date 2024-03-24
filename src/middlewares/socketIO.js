const {Server} = require("socket.io");
const ApiError = require("../utils/apiError");

let io;

const initSocketIO = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("a user connected to socket.IO");
    });
}

const getSocketIO = () => {
    if (!io) {
        return Promise.reject(new ApiError(`Socket IO not initialize`, 400));
    }

    return io;
}

module.exports = {
    initSocketIO,
    getSocketIO,
}