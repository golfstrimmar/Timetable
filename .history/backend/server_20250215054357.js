import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import multer from "multer";
import { Server } from "socket.io";
import http from "http";
import Event from "./models/event.js";
// =================================
const upload = multer();
connectDB();
const app = express();
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// // -------------------------------------
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
// // -------------------------------------
io.on("connection", (socket) => {
  console.log(`Client connected with SID: ${socket.id}`);

  // ----------------------
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`----Client 15 min:---- ${room}`);
  });

  // ----------------------
  socket.on("getAllEvents", async () => {
    console.log("=====getAllEvents======");

    try {
      const events = await Event.find({});
      console.log("---Found events:---", events);
      io.emit("receiveAllEvents", { success: true, events: events });
    } catch (err) {
      console.log("---Error fetching events:---", err);
      io.emit("receiveAllEvents", { success: false, error: err.message });
    }
  });

  // ----------------------
  socket.on("sendEvent", async (msg) => {
    console.log("=+++===data Event:==+++====", msg.date);
    try {
      const newEvent = new Event({
        date: msg.date,
        content: msg.content,
        status: msg.status,
      });
      console.log("=+++===new Event socket:==+++====", newEvent);
      await newEvent.save();
      const events = await Event.find({});
      // io.emit("receiveAllEvents", { success: true, events: events });
      io.emit("receiveEvent", { success: true, event: newEvent });
    } catch (error) {
      console.error("=======Error sending Event socket:========", error);
      io.emit("receiveEvent", { success: false, error: error.message });
    }
  });
  // ----------------------
  socket.on("sendEvents", async (events) => {
    console.log("===+++===Received events:===+++==", events);

    try {
      const eventPromises = events.map((msg) => {
        const newEvent = new Event({
          date: msg.date,
          content: msg.content,
          status: msg.status,
        });
        return newEvent.save();
      });

      // Ждем завершения всех сохранений
      await Promise.all(eventPromises);

      const allEvents = await Event.find({});
      io.emit("receiveAllEvents", { success: true, events: allEvents });
      io.emit("receiveEvents", { success: true, events: events });
    } catch (error) {
      console.error("Error sending events:", error);
      io.emit("receiveEvents", { success: false, error: error.message });
    }
  });

  // ----------------------

  socket.on("changeStatus", async (Data) => {
    console.log("*****changeStatus*****", Data.id);
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        Data.id,
        {
          status: Data.status,
        },
        { new: true }
      );

      if (!updatedEvent) {
        socket.emit("error", "Event not found.");
        return;
      }

      console.log("*****changeStatus event:*****", updatedEvent);
      io.emit("receiveEvent", updatedEvent);
      // io.emit("receiveAllEvents", { success: true, events: events });
    } catch (error) {
      console.error("Error updating event:", error);
      io.emit("receiveEvent", { success: false, error: error.message });
    }
  });
  // ----------------------
  socket.on("editEvent", async (updatedEventData) => {
    console.log("*****editEvent*****", updatedEventData._id);
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        updatedEventData._id,
        {
          _id: updatedEventData._id,
          date: updatedEventData.date,
          content: updatedEventData.content,
        },
        { new: true }
      );

      if (!updatedEvent) {
        socket.emit("error", "Event not found.");
        return;
      }

      console.log("******edit Event:*******", updatedEvent);
      io.emit("receiveEvent", updatedEvent);
    } catch (error) {
      console.error("Error updating Event:", error);
      socket.emit("error", "Failed to update Event.");
    }
  });
  // ----------------------

  socket.on("deliteEvent", async (id) => {
    console.log("*****deliteEvent*****", id);
    try {
      const event = await Event.findByIdAndDelete(id);
      if (!event) {
        console.log("Event not found");
      } else {
        console.log("--Event deleted--:", event);
        io.emit("deleteEvent", event);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  });
  // ----------------------
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});

