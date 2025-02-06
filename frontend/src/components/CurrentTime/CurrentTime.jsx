import React, { useState, useEffect } from "react";
import "./CurrentTime.scss";
import { ReactComponent as Time } from "../../assets/svg/time.svg";
import { ReactComponent as Calendar } from "../../assets/svg/calendar.svg";
import { Link, useLocation } from "react-router-dom";
const CurrentTime = () => {
  const [timerYears, setTimerYears] = useState(0);
  const [timerMonths, setTimerMonths] = useState("");
  const [timerdayOfWeek, setTimerdayOfWeek] = useState("");
  const [timerDays, setTimerDays] = useState(0);
  const [timerHours, setTimerHours] = useState("00");
  const [timerMinutes, setTimerMinutes] = useState("00");
  const [timerSeconds, setTimerSeconds] = useState("00");
  const updateTime = () => {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.toLocaleString("de-DE", { month: "long" });
    const day = currentTime.getDate();
    const dayOfWeek = currentTime.toLocaleString("de-DE", { weekday: "long" });
    const hours = String(currentTime.getHours()).padStart(2, "0");
    const minutes = String(currentTime.getMinutes()).padStart(2, "0");
    const seconds = String(currentTime.getSeconds()).padStart(2, "0");

    setTimerYears(year);
    setTimerMonths(month);
    setTimerdayOfWeek(dayOfWeek);
    setTimerDays(day);
    setTimerHours(hours);
    setTimerMinutes(minutes);
    setTimerSeconds(seconds);
  };

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    updateTime();
    return () => clearInterval(interval);
  }, []);
  const [openKalendar, setOpenKalendar] = useState(false);
  const location = useLocation();
  const getActiveLinkStyle = (path) => {
    return location.pathname === path
      ? {
          boxShadow: "inset 0 0 18px #04286F, 0 0 10px #0445C6",
        }
      : null;
  };
  // ---------------------------
  return (
    <>
      <div className="icons">
        <Link
          to="/"
          className="kalendar-icon"
          style={{ right: "100px", ...getActiveLinkStyle("/") }}
        >
          <Calendar />
        </Link>
        <Link
          to="/commonday"
          className="kalendar-icon"
          style={getActiveLinkStyle("/commonday")}
        >
          <Time />
        </Link>
      </div>
      <div className="currentTime">
        <div className="currentTime-oben">
          <div className="currentTime-item currentTime-item--hour">
            {timerHours}
          </div>
          <span>:</span>
          <div className="currentTime-item currentTime-item--minute">
            {timerMinutes}
          </div>
          <div className="currentTime-item currentTime-item--second">
            {timerSeconds}
          </div>
        </div>
        <div className="currentTime-low">
          <div className="currentTime-item">{timerdayOfWeek}</div>
          <div className="currentTime-item">{timerDays}</div>
          <div className="currentTime-item">{timerMonths}</div>
          <div className="currentTime-item">{timerYears}</div>
        </div>
      </div>
    </>
  );
};

export default CurrentTime;
