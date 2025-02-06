import React, { useState, useEffect, useRef } from "react";
import "./Weg.scss";
import CurrentTime from "../CurrentTime/CurrentTime";
import { useSelector, useDispatch } from "react-redux";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Event from "../Event/Event";
const Weg = () => {
  const [clapp, setClapp] = useState(false);

  const [timerHoursWeg, setTimerHoursWeg] = useState("00");
  const [timerMinutesWeg, setTimerMinutesWeg] = useState("00");
  // const updateTimerHours = (hours) => {
  //   setTimerHoursWeg(hours);
  // };
  // const updateTimerMinutes = (minutes) => {
  //   setTimerMinutesWeg(minutes);
  // };
  const [dateNow, setDateNow] = useState("");
  // ---------------------------
  const AllEvents = useSelector((state) => state.events.events);
  // ---------------------------
  const [netItems, setNetItems] = useState(Array.from({ length: 12 }));

  // useEffect(() => {
  //   const allWeg = AllEvents?.filter(
  //     (el) =>
  //       new Date(el.date).toLocaleString("de-DE").slice(0, 13) ===
  //       new Date().toLocaleString("de-DE").slice(0, 13)
  //   );
  //   console.log("===allWeg===", allWeg);
  //   if (allWeg?.length === 0) {
  //     setClapp(true);
  //   } else {
  //     setClapp(false);
  //   }
  // }, [AllEvents]);
  // ---------------------------
  return (
    <>
    

      <div className={`weg weg-natur  ${clapp ? "_clappet" : ""} `}>
        <div className="time-marker ">
          <span
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            {timerHoursWeg}:00
          </span>
        </div>
        <button
          className="klappen"
          onClick={() => {
            setClapp(!clapp);
          }}
          style={{ transform: `${clapp ? "rotate(180deg)" : ""}` }}
        >
          <ArrowUpwardIcon />
        </button>
        {/* <div className="time-marker">
          <span>{timerdayOfWeek}</span>
          <h3>{timerDays}</h3>
          <span>{timerMonths}</span>
          <span>{timerYears}</span>
        </div> */}

        <div className={`net`}>
          {netItems.map((_, index) => (
            <div
              key={index}
              className="net-item"
              style={{
                backgroundColor: `${index <= parseInt(timerMinutesWeg) / 5 ? "#04286F" : "rgba(228, 228, 228, 0.86)"}`,
              }}
            >
              {index}
              {parseInt(timerMinutesWeg) / 5}
              {index <= Math.floor(parseInt(timerMinutesWeg) / 5) &&
                Math.floor(parseInt(timerMinutesWeg) / 5) < index + 1 && (
                  <div className="lila-line">
                    <span>
                      {timerHoursWeg} : {timerMinutesWeg}
                    </span>
                  </div>
                )}
              <span
                className="offset"
                style={{
                  color:
                    index <= Math.floor(parseInt(timerMinutesWeg) / 5)
                      ? "#FFFEC9"
                      : "initial",
                }}
              >
                {timerHoursWeg} : {String(index * 5).padStart(2, "0")}
              </span>
              <div className="events-list">
                {/* {new Date(event.date).toLocaleString()} */}
                {AllEvents &&
                  AllEvents.filter((event) => {
                    return (
                      new Date(event.date).toLocaleString() ===
                      String(index * 5).padStart(2, "0")
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Weg;
