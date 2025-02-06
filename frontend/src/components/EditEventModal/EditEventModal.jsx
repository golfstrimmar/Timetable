import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { editEvent, getAllEvents } from "../../redux/actions/eventsActions";
import "./EditEventModal.scss";
import EventStatus from "../EventStatus/EventStatus";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import GermanCalendar from "../GermanCalendar/GermanCalendar";
import TimeMinuts from "../TimeMinuts/TimeMinuts";
function EditEventModal({ open, onClose, id, date, content, status }) {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const [eventData, setEventData] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [startUhr, setStartUhr] = useState("00");
  const [startMinuts, setStartMinuts] = useState("00");
  const [openMessage, setOpenMessage] = useState(false);
  const [AlertMessage, setAlertMessage] = useState("");
  //  ======================================

  useEffect(() => {
    if (date) {
      console.log("===--- date ---====", date);
      const newUhr = new Date(date).getHours().toString().padStart(2, "0");
      const newMinuts = new Date(date).getMinutes().toString().padStart(2, "0");
      setStartUhr(newUhr);
      setStartMinuts(newMinuts);
    }
  }, [date]);
  useEffect(() => {
    setStartDate(
      new Date(date).toLocaleString("de-DE", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
      })
    );
    setEventData({
      _id: id,
      date: new Date(date),
      content: content,
      status: status,
    });
    return () => {
      setStartDate(null);
      setEventData({});
    };
  }, [id, date, content, status]);

  // useEffect(() => {
  //   console.log("====---------eventData", eventData);
  // }, [eventData]);

  const handleDateChange = (data) => {
    setStartDate(
      new Date(data).toLocaleString("de-DE", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
      })
    );
    setEventData({
      ...eventData,
      date: new Date(data),
    });
  };
  const handleUhrChange = (data) => {
    setStartUhr(data);
  };
  const handleMinutsChange = (data) => {
    setStartMinuts(data);
  };
  const handleContentChange = (event) => {
    setEventData({
      ...eventData,
      content: event.target.value,
    });
  };

  const correctDate = (foo) => {
    let newDate = new Date(foo.date);
    newDate.setHours(startUhr);
    newDate.setMinutes(startMinuts);
    let temp = { ...foo, date: newDate };
    return temp;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let neweventData = eventData;
    neweventData = correctDate(eventData);
    socket.emit("editEvent", neweventData);
    socket.on("receiveEvent", (response) => {
      console.log("*********event edit*********", response);
      if (response) {
        dispatch(editEvent(response));
        setOpenMessage(true);
        setAlertMessage("Event edited.");
        setTimeout(() => {
          setOpenMessage(false);
          setAlertMessage("");
          onClose();
        }, 3000);
      }
    });
  };
  const haldlerClose = () => {
    setOpenMessage(false);
    setAlertMessage("");
    onClose();
  };

  return (
    <>
      <Dialog open={openMessage}>
        <DialogContent>{AlertMessage}</DialogContent>
      </Dialog>
      <Dialog open={open} onClose={onClose} className="editeventmodal">
        <DialogContent className="editeventmodal__content">
          <div className="content-head">
            <GermanCalendar
              transData={date}
              handleDateChange={handleDateChange}
            />

            <div className="content-timers">
              <TimeMinuts
                length={24}
                handleTimeChange={handleUhrChange}
                startUhr={new Date(date).getHours().toString().padStart(2, "0")}
              />
              <span>:</span>
              <TimeMinuts
                length={12}
                handleTimeChange={handleMinutsChange}
                startMinuts={new Date(date)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}
              />
            </div>
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={eventData.content}
              onChange={handleContentChange}
            />
          </div>
          <div className="klappen-buttons" style={{ marginTop: 20 }}>
            <Button
              className="klappen-buttons-button"
              type="button"
              variant="contained"
              color="info"
              onClick={() => {
                haldlerClose();
              }}
              style={{ marginRight: "20px" }}
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
          </div>{" "}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EditEventModal;
