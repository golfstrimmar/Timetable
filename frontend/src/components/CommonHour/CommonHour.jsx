import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./CommonHour.scss";
import Event from "../Event/Event";
const CommonHour = ({ hour, currentHour }) => {
  // const [clapp, setClapp] = useState(true);
  const [netItems, setNetItems] = useState(Array.from({ length: 12 }));
  //  =========================
  let temp = String(hour).padStart(2, "0") + ":00";
  let time = new Date().toLocaleString("de-DE", {
    year: "numeric",
    month: "long",
    weekday: "long",
    day: "numeric",
  });
  let timerHours = String(hour).padStart(2, "0");
  const AllEvents = useSelector((state) => state.events.events);
  //  =========================

  //  =========================
  return (
    <div
      className="commonhour"
      style={{
        backgroundColor: `${currentHour > hour ? "#04286F" : ""} ${currentHour < hour ? "rgba(228, 228, 228, 0.86)" : ""} `,
        marginLeft: `${hour * 2}px`,
      }}
    >
      <div className={`weg `}>
        <div className="time-marker ">
          <span
            style={{
              color: `${currentHour > hour ? "white" : ""} `,
            }}
          >
            {temp}
          </span>
        </div>
        {/* <div className="time-marker" style={{ marginLeft: "30px" }}>
          <span>{time}</span>
        </div> */}
        <div className="events-list">
          {AllEvents &&
            AllEvents
              // .filter((event) => {
              //   return (
              //     event.date.slice(14, 16) === String(index * 5).padStart(2, "0")
              //   );
              // })
              .filter((event) => {
                return (
                  new Date(event.date).toLocaleString().slice(12, 14) ===
                  timerHours
                );
              })
              .filter((event) => {
                return (
                  new Date(event.date).toLocaleString().slice(0, 12) ===
                  new Date().toLocaleString().slice(0, 12)
                );
              })
              .map((event, i) => (
                <>
                  {/* <p>status:{event.status ? "true" : "false"}</p> */}
                  <Event
                    key={i}
                    id={event._id}
                    date={event.date}
                    content={event.content}
                    status={event.status}
                  />
                </>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CommonHour;
