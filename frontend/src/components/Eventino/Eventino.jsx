import React, { useState, useEffect, useMemo } from "react";
import "./Eventino.scss";
import { useParams, useNavigate } from "react-router-dom";
import GermanCalendar from "../GermanCalendar/GermanCalendar";
import TimeMinuts from "../TimeMinuts/TimeMinuts";
import { Button, Dialog, DialogContent, TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { editEvent } from "../../redux/actions/eventsActions";
import Loading from "../Loading/Loading";
import { deliteEvent } from "../../redux/actions/eventsActions";
import Event from "../EventStatus/EventStatus";
import EventStatus from "../EventStatus/EventStatus";
const Eventino = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const AllEvents = useSelector((state) => state.events.events);
  const MEvents = useMemo(() => AllEvents, [AllEvents]);
  const [startUhr, setStartUhr] = useState("00");
  const [startMinuts, setStartMinuts] = useState("00");
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [event, setEvent] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDelite, setOpenDelite] = useState(false);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  // //////////////////////////////////////////////////////////
  useEffect(() => {
    if (id) {
      const ev = MEvents.find((el) => el?._id === id);
      console.log("===--- ev ---====", ev);
      if (ev) {
        setEvent({
          _id: ev?._id,
          date: new Date(ev?.date),
          content: ev?.content,
          status: ev?.status,
        });
        setEventData({
          _id: ev?._id,
          date: new Date(ev?.date),
          content: ev?.content,
          status: ev?.status,
        });
        // setStartUhr(new Date(event.date).getHours());
        // setStartMinuts(new Date(event.date).getMinutes());
      }
    }
  }, [id]);
  useEffect(() => {
    console.log("===--- event ---====", event);
  }, [event]);
  useEffect(() => {
    if (event) {
      let newDate = new Date(event.date);
      newDate.setHours(startUhr);
      setEvent({
        ...event,
        date: newDate,
      });
    }
  }, [startUhr]);
  useEffect(() => {
    if (event) {
      let newDate = new Date(event.date);
      newDate.setMinutes(startMinuts);
      setEvent({
        ...event,
        date: newDate,
      });
    }
  }, [startMinuts]);

  const handleDateChange = (data) => {
    let newDate = new Date(eventData.date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    newDate = new Date(data);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setEventData({
      ...eventData,
      date: newDate,
    });
  };

  const handleUhrChange = (data) => {
    // setStartUhr(data);
    // if (event) {
    let newDate = new Date(eventData.date);
    newDate.setHours(data);
    setEventData({
      ...eventData,
      date: newDate,
    });
    // }
  };
  const handleMinutsChange = (data) => {
    // setStartMinuts(data);
    // if (event) {
    let newDate = new Date(eventData.date);
    newDate.setMinutes(data);
    setEventData({
      ...eventData,
      date: newDate,
    });
    // }
  };
  const handleContentChange = (event) => {
    setEventData({
      ...eventData,
      content: event.target.value,
    });
  };
  const haldlerClear = () => {
    setEventData({
      _id: event?._id,
      date: new Date(event?.date),
      content: event?.content,
      status: event?.status,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const neweventData = {
      ...eventData,
      date: new Date(eventData.date).toISOString(),
    };
    console.log("===--- neweventData ---====", neweventData);
    setLoading(true);
    socket.emit("editEvent", neweventData);
    socket.on("receiveEvent", (response) => {
      if (response) {
        console.log("*********event edit*********", response);
        dispatch(editEvent(response));
        let newStorage = localStorage.getItem("events");
        newStorage = JSON.parse(newStorage);
        newStorage = newStorage.map((el) => {
          if (el._id === response._id) {
            return response;
          }
          return el;
        });
        localStorage.setItem("events", JSON.stringify(newStorage));
        setOpenMessage(true);
        setAlertMessage("Event edited.");
        setLoading(false);
        setTimeout(() => {
          setOpenMessage(false);
          setAlertMessage("");
          navigate(`/`);
        }, 3000);
      }
    });
  };
  useEffect(() => {
    if (message !== "") {
      setOpenDelite(true);
    }
  }, [message]);
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
          setMessage("");
          navigate(`/`);
        }, 2000);
      }
    });
  };
  const handleCloseDelite = () => {
    setOpenDelite(false);
  };
  return (
    <div className="eventino">
      <Loading loading={loading}></Loading>
      <Dialog open={openMessage} className="">
        <DialogContent>{alertMessage}</DialogContent>
      </Dialog>
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
      {/* <div className="eventino-origin">
            <div >Event id: {event?._id}</div>
            <div >Event date:{new Date(event?.date).toLocaleString("de-DE", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  year: "numeric",
                })}</div> 
            <div >Event content: {event?.content}</div>
      </div> */}
      {/* {event && (
        <div className="eventino-result"> 
           <div className="eventino-id">
            Event id: {event._id}
          </div>
          <div className="eventino-date">
            Event date:
            <span>
               { new Date(event.date).toLocaleString("de-DE", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  year: "numeric",
                })}
            </span>
          </div> 
          <div className="eventino-content">
            Event content: <span>{event.content}</span>
          </div> 
           <div className="eventino-status ">
            Event status: {event.status ? "true" : "false"}
          </div> 
         </div> 
       )}   */}
      {event && (
        <div className="eventino-plaza">
          {/* <div className="eventino-timers"> */}

          <GermanCalendar
            handleDateChange={handleDateChange}
            transData={event.date}
          />
          <TimeMinuts
            length={24}
            handleTimeChange={handleUhrChange}
            startUhr={new Date(event.date).getHours()}
          />
          <span>:</span>
          <TimeMinuts
            length={12}
            handleTimeChange={handleMinutsChange}
            startMinuts={new Date(event.date).getMinutes()}
          />

          <textarea
            type="text"
            className="eventino-textfield"
            value={eventData.content}
            onChange={handleContentChange}
            placeholder="Event content"
          />

          {/* </div> */}
        </div>
      )}
      {eventData && (
        <div className="eventino-result">
          {/* <div className="eventino-id">Event id: {eventData._id}</div> */}
          <div className="eventino-date">
            Event date:
            <span>
              {new Date(eventData.date).toLocaleString("de-DE", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="eventino-content">
            Event content: <span>{eventData.content}</span>
          </div>
          <div className="eventino-status ">
            {/* Event status: {eventData.status ? "true" : "false"} */}

            <EventStatus id={id} status={eventData.status} />
          </div>
        </div>
      )}
      <div className="klappen-buttons" style={{ marginTop: 20 }}>
        <Button
          className="klappen-buttons-button"
          type="button"
          variant="contained"
          color="info"
          onClick={() => {
            haldlerClear();
          }}
        >
          <span className="addbuttons-icon ">🔙</span>
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          className="klappen-buttons-button"
          onClick={handleSubmit}
        >
          <span className="addbuttons-icon ">💾</span>
        </Button>
        <Button
          type="button"
          variant="contained"
          color="warning"
          className="Dialog-delite"
          onClick={() => {
            setOpenDelite(true);
          }}
        >
          ❌
        </Button>
      </div>{" "}
    </div>
  );
};

export default Eventino;
