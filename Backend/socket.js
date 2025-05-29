const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      try {
        const { userId, userType } = data;
    
        if (!userId || !userType) {
          return socket.emit("error", { message: "Invalid join data" });
        }
    
        if (userType === "user") {
          const user = await userModel.findById(userId);
          if (!user) {
            return socket.emit("error", { message: "User not found" });
          }
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          const captain = await captainModel.findById(userId);
          if (!captain) {
            return socket.emit("error", { message: "Captain not found" });
          }
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }
      } catch (err) {
        console.error("Error in join event:", err.message);
        socket.emit("error", { message: "Internal server error" });
      }
    });
    
    socket.on("update-location-captain", async (data) => {
      try {
        const { userId, location } = data;
    
        if (!userId || !location || isNaN(location.ltd) || isNaN(location.lng)) {
          return socket.emit("error", { message: "Invalid location data" });
        }
    
        const captain = await captainModel.findById(userId);
        if (!captain) {
          return socket.emit("error", { message: "Captain not found" });
        }
    
        await captainModel.findByIdAndUpdate(userId, {
          location: {
            ltd: parseFloat(location.ltd),
            lng: parseFloat(location.lng),
          },
        });
      } catch (err) {
        console.error("Error in update-location-captain event:", err.message);
        socket.emit("error", { message: "Internal server error" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
