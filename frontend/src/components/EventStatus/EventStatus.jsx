import React, { useState, useEffect } from "react";
import "./EventStatus.scss";
import { ReactComponent as Ja } from "../../assets/svg/ja.svg";
import { ReactComponent as No } from "../../assets/svg/no.svg";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { updateStatusEvent } from "../../redux/actions/eventsActions";
const Event = ({ status, id }) => {
  const dispatch = useDispatch();
  const [statusChange, setStatusChange] = useState(status);
  const socket = useSelector((state) => state.socket.socket);
  useEffect(() => {
    // console.log("===Event id Event Status===", id, status);
    setStatusChange(status);
  }, [status]);
  // useEffect(() => {
  //   setStatusChange(status);
  // }, [status]);

  const handleChange = (event) => {
    // console.log("===Event id Event Status===", id, event.target.checked);
    setStatusChange(event.target.checked);
    socket?.emit("changeStatus", {
      id: id,
      status: event.target.checked,
    });
    socket.on("receiveEvent", (response) => {
      dispatch(updateStatusEvent(response));
    });
  };

  return (
    <div className="event-status">
      <FormControlLabel
        control={
          <Checkbox
            checked={statusChange}
            onChange={handleChange}
            name="status"
          />
        }
        label={
          statusChange ? <Ja className="ja"></Ja> : <No className="nein"></No>
        }
      />
    </div>
  );
};

export default Event;
