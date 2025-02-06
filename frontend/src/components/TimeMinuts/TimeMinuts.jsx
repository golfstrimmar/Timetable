import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import "./TimeMinuts.scss";
const TimeMinuts = ({
  length,
  title,
  handleTimeChange,
  startMinuts,
  startUhr,
}) => {
  const [clapp, setClapp] = useState(false);
  const [minutesResult, setMinutesResult] = useState("00");
  useEffect(() => {
    // if (startMinuts === "00" || startUhr === "00") {
    //   setMinutesResult("00");
    // } else
    if (startMinuts) {
      setMinutesResult(startMinuts);
    } else if (startUhr) {
      setMinutesResult(startUhr);
    }
  }, [startMinuts, startUhr]);

  useEffect(() => {
    handleTimeChange(minutesResult);
  }, [minutesResult]);
  return (
    <div className="timeminuts">
      <h4>{title}</h4>
      <div className="timeminuts-header">
        {/* <button
          type="button"
          className="klappen klappen-buttons-button"
          style={{ transform: `${clapp ? "" : "rotate(180deg)"}` }}
        >
          <ArrowUpwardIcon />
        </button> */}
        <div
          onClick={() => {
            setClapp(!clapp);
          }}
          className="minutesResult"
        >
          {minutesResult}
        </div>
      </div>
      <div className={`timeminuts-plaza  ${clapp ? "run" : ""} `}>
        {Array.from({ length: length }).map((_, i) => {
          return (
            <div
              key={i}
              className="timeminuts-item"
              onClick={() => {
                length === 12
                  ? setMinutesResult((i * 5).toString().padStart(2, "0"))
                  : setMinutesResult(i.toString().padStart(2, "0"));
                setClapp(!clapp);
              }}
            >
              {length === 12
                ? (i * 5).toString().padStart(2, "0")
                : i.toString().padStart(2, "0")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeMinuts;
