import React from "react";
import PropTypes from "prop-types";

const CalendarDay = React.memo(({ day, formattedDate, onClick, events }) => {
  const isCurrentDay = day === formattedDate;
  const isEmpty = !day;

  return (
    <div
      className={`-day ${isCurrentDay ? "day-now" : ""}`}
      style={{
        background: isCurrentDay
          ? "#6B5F00"
          : isEmpty
            ? "transparent"
            : "rgba(255, 255, 255, 0.396)",
        outline: isEmpty ? "none" : "",
      }}
    >
      <div
        className="day-info"
        style={{ color: isCurrentDay ? "#FFFEC9" : "" }}
      >
        {!isEmpty && (
          <span className="day-number" onClick={() => onClick(day)}>
            {day.replace(/\D/g, "")}
          </span>
        )}
      </div>
      {!isEmpty && events}
    </div>
  );
});

CalendarDay.propTypes = {
  day: PropTypes.string,
  formattedDate: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  events: PropTypes.node,
};

export default CalendarDay;
