export default function setupSocketEvents(io) {
  // Listen for new socket connections
  io.on("connection", (socket) => {
    console.log("User connected");

    // Event when a user acquires keyboard control
    socket.on("keyboard-control-acquired", ({ user }) => {
      // Broadcast to all connected clients that a user has taken control
      io.emit("keyboard-control-acquired", { user });
    });

    // Event when a user releases keyboard control
    socket.on("keyboard-control-released", () => {
      // Notify all connected clients that the keyboard control is now free
      io.emit("keyboard-control-released");
    });

    // Event when a key is pressed
    socket.on("key-pressed", ({ data }) => {
      // Broadcast the key press event to all connected clients
      io.emit("key-pressed", { data });
    });

    // Event when a user disconnects from the socket
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
