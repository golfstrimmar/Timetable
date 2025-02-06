import React, { useState, useEffect } from "react";
import "./Event.scss";
import EditEventModal from "../EditEventModal/EditEventModal";
import EventStatus from "../EventStatus/EventStatus";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { deliteEvent } from "../../redux/actions/eventsActions";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogContent } from "@mui/material";
const Event = React.memo(({ id, date, content, status, actuel }) => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const [openModal, setOpenModal] = useState(false);
  const [openDelite, setOpenDelite] = useState(false);
  const [alert, setAlert] = useState(false);
  const [RedAlert, setRedAlert] = useState(false);
  const dateEvent = date;
  const [temp, setTemp] = useState();
  const [message, setMessage] = useState("");
  // ==========================
  const [passt, setPasst] = useState(false);
  const [now, setNow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  // --/////////////////////////////
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (new Date() > new Date(date)) {
      setPasst(true);
    } else if (new Date() === new Date(date)) {
      setNow(true);
    } else {
      setNow(false);
      setPasst(false);
    }
  }, [date]);

  useEffect(() => {
    if (
      temp < new Date(date) &&
      (new Date(date) - temp) / 1000 / 60 <= 30 &&
      (new Date(date) - temp) / 1000 / 60 > 10
    ) {
      setAlert(true);
      setRedAlert(false);
    } else if (
      temp < new Date(date) &&
      (new Date(date) - temp) / 1000 / 60 <= 10
    ) {
      setAlert(false);
      setRedAlert(true);
    } else {
      setAlert(false);
      setRedAlert(false);
    }
  }, [temp]);

  // ===============================

  const handleDeliteEvent = (id) => {
    socket.emit("deliteEvent", id);
    socket.on("deleteEvent", (response) => {
      if (response) {
        console.log("===--- deliteEvent ---====", response);
        dispatch(deliteEvent(response._id));
        let newStorage = localStorage.getItem("events");
        newStorage = JSON.parse(newStorage);
        if (newStorage) {
          newStorage = newStorage.filter((el) => {
            return el._id !== response._id;
          });
          localStorage.setItem("events", JSON.stringify(newStorage));
        }
        setMessage("Event deleted.");
        setTimeout(() => {
          setOpenModal(false);
          setOpenDelite(false);
          setMessage("");
        }, 2000);
      }
    });
  };
  // const handleEditEvent = () => {
  //   setOpenModal(true);
  // };
  // const handleCloseModal = () => {
  //   setOpenModal(false);
  // };

  // =========================
  const handleCloseDelite = () => {
    setOpenDelite(false);
  };
  // =========================
  // =========================
  // =========================
  const handelGoEventino = () => {
    let formattedDate = new Date(date).toLocaleDateString("de-DE");
    console.log("===--- formattedDate ---====", formattedDate);
    navigate(`/event/${id}`);
  };
  // =========================
  // =========================
  // =========================

  return (
    <div
      className={`event  ${actuel ? "_is-actuel" : ""} ${alert ? "blueAlert" : ""} ${RedAlert ? "RedAlert" : ""}`}
    >
     
      <Dialog open={openDelite} onClose={handleCloseDelite}>
        <DialogContent>
          <div className="delite-grupe">
            <span
              className="Dialog-delite"
              onClick={() => {
                setOpenDelite(false);
              }}
            >
              🔙
            </span>
            <span
              className="Dialog-delite"
              onClick={() => {
                handleDeliteEvent(id);
              }}
            >
              ❌
            </span>
          </div>
          <h4 style={{ textAlign: "center", color: "red" }}>{message}</h4>
        </DialogContent>
      </Dialog>

      <div
        className="event-date"
        style={{
          color: `${passt ? "rgba(250, 250, 250)" : ""} ${now ? "rgba(250, 250, 250)" : ""}`,
          backgroundColor: `${passt ? "#04286F" : ""} ${now ? "red" : ""}`,
          boxShadow: `${now ? "inset 0 0 10px rgba(250, 250, 250)" : ""}`,
        }}
      >
        {date !== "" &&
          new Date(date).toLocaleString("de-DE", {
            // month: "long",
            // day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
      </div>
      <div
        className="event-content"
        onClick={() => {
          handelGoEventino();
        }}
      >
        {content}
      </div>
      {/* <div
        className="event-edit"
        // onClick={() => {
        //   // handleEditEvent(id);
        //   // handelGoEventino(id);
        // }}
      >
        <EditIcon />
      </div> */}
      {/* <EventStatus id={id} status={status} /> */}
      {/* <span
        className="event-delite"
        onClick={() => {
          setOpenDelite(true);
        }}
      >
        ❌
      </span> */}
      {/* <EditEventModal
        open={openModal}
        onClose={handleCloseModal}
        id={id}
        date={date}
        content={content}
        status={status}
      /> */}
    </div>
  );
});

export default Event;
