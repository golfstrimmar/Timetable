import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import CalendarDay from "./CalendarDay";
import KalendarLinia from "./KalendarLinia";
MonthRenderer.propTypes = {
  monthIndex: PropTypes.number.isRequired,
  isCurrentMonth: PropTypes.bool.isRequired,
  formattedDate: PropTypes.string.isRequired,
  onDayClick: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      content: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  onClickMonth: PropTypes.func.isRequired,
};
const MonthRenderer = forwardRef(
  (
    {
      monthIndex,
      isCurrentMonth,
      formattedDate,
      onDayClick,
      events,
      onClickMonth,
    },
    ref
  ) => {
    // Логика рендеринга месяца (перенести из старого renderMonth)
    const monthData = renderMonth(monthIndex); // Ваша оптимизированная функция

    return (
      <div
        className="kalendar-unit--container"
        ref={ref}
        style={{
          background: isCurrentMonth ? "rgba(255, 254, 201, 0.4)" : "",
        }}
      >
        <div className="month-name">
          <h3
            onClick={() => onClickMonth(monthIndex)}
            style={{
              background: isCurrentMonth ? "#6B5F00" : "#04286F",
            }}
          >
            {monthData[0]}
          </h3>
        </div>

        <div className="kalendar-unit">
          <KalendarLinia />
          <div className="kalendar-line">
            {monthData.slice(1).map((day, index) => (
              <CalendarDay
                key={`${monthIndex}-${index}`}
                day={day}
                formattedDate={formattedDate}
                onClick={onDayClick}
                events={events && getEventsForDay(day, events)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

MonthRenderer.propTypes = {
  monthIndex: PropTypes.number.isRequired,
  isCurrentMonth: PropTypes.bool.isRequired,
  formattedDate: PropTypes.string.isRequired,
  onDayClick: PropTypes.func.isRequired,
  events: PropTypes.array,
  onClickMonth: PropTypes.func.isRequired,
};

export default React.memo(MonthRenderer);
