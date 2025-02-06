import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  TextareaAutosize,
} from "@mui/material";
import "./AddEventForm.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";

const AddEventForm = ({ onClose, date }) => {
  const socket = useSelector((state) => state.socket.socket);
  const [startDate, setStartDate] = useState(new Date(date));
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    date: startDate,
    content: "",
    status: false,
  });

  const handleChangeDate = (date) => {
    setStartDate(date);
  };

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      date: startDate,
    }));
  }, [startDate]);

  const handleChangeContent = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("sendEvent", formData);
    }
    socket.on("receiveEvent", (response) => {
      console.log("===+++==response:===+++==", response);
      if (response.success) {
        setStartDate(new Date());
        setFormData({
          date: startDate,
          content: "",
          status: false,
        });
        onClose();
      } else if (response.error) {
        console.error("===Error from server====", response.error);
        setErrorMessage("content?");
        setTimeout(() => {
          setErrorMessage("");
        }, 1000);
      }
    });
  };

  const formattedDate = startDate ? startDate.toString() : "";
  let str = formattedDate.replace(/GMT.*$/, "").trim();
  const time = str.match(/\d{2}:\d{2}:\d{2}/)[0];
  const newStr = str.replace(time, "").trim();
  const dateParts = newStr.split(" ");
  const newDateString = ` ${dateParts[2]} ${dateParts[1]}`;
  const dateY = ` ${dateParts[3]}`;
  const dateDay = ` ${dateParts[0]}`;
  // ==============================
  const handelCancel = () => {
    setStartDate(new Date());
    setFormData({
      date: startDate,
      content: "",
      status: false,
    });
    onClose();
  };
  // ==============================
  return (
    <>
      <form onSubmit={handleSubmit} className=" addEventForm">
        <div className="date-inputs">
          <DatePicker
            selected={startDate}
            onChange={handleChangeDate}
            showTimeSelect
            timeIntervals={5}
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            showTimeSelectOnly
          />
        </div>
        <p>
          {new Date(startDate).toLocaleString("de-DE", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            year: "numeric",
          })}
        </p>
        {formData && <p className="form-content">{formData.content}</p>}
        <TextareaAutosize
          className="addEvent-input"
          aria-label="content"
          minRows={4}
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChangeContent}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        />
        <h5
          style={{
            color: "red",
          }}
        >
          {errorMessage}
        </h5>
        <div className="addbuttons">
          <Button
            type="button"
            style={{ marginTop: "20px" }}
            onClick={handelCancel}
          >
            <span className="addbuttons-icon addbuttons-icon--back">🔙</span>
          </Button>
          <Button type="submit" style={{ marginTop: "20px" }}>
            <span className="addbuttons-icon addbuttons-icon--delite">💾</span>
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddEventForm;
