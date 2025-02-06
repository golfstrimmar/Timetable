import React, { useEffect, useRef, useState } from "react";
import { setSocket } from "./redux/actions/socketActions";
import { setAllEvents } from "./redux/actions/eventsActions";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import AppRouter from "./router/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import CurrentTime from "./components/CurrentTime/CurrentTime";

const serverUrl = process.env.REACT_APP_API_URL;
function App() {
  const dispatch = useDispatch();
  const AllEvents = localStorage.getItem("events");

  useEffect(() => {
    const socket = io(serverUrl);
    socket.on("connect", () => {
      console.log("Connected to server with id:", socket.id);
      dispatch(setSocket(socket));
      localStorage.clear();
      // const StorageEvents = localStorage.getItem("events");
      // console.log("++++StorageEvents++++", StorageEvents);
      if (localStorage.length === 0) {
        socket.emit("getAllEvents");
        socket.on("receiveAllEvents", (response) => {
          console.log("++++receiveAllEvents++++", response);
          dispatch(setAllEvents(response.events));
          localStorage.setItem("events", JSON.stringify(response.events));
        });
      } else {
        let StorageEvents = localStorage.getItem("events");
        StorageEvents = JSON.parse(StorageEvents);
        dispatch(setAllEvents(StorageEvents));
      }
    });

    return () => {
      socket.disconnect();
      dispatch(setSocket(null));
    };
  }, []);

  return (
    <Router>
      <CurrentTime />
      <AppRouter />
    </Router>
  );
}

export default App;
