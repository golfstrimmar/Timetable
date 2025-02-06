import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./CommonDay.scss";
import Weg from "../Weg/Weg";
import Event from "../Event/Event";
import CurrentTime from "../CurrentTime/CurrentTime";
const CommonDay = () => {
  const dispatch = useDispatch();
  const AllEvents = useSelector((state) => state.events.events);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [offset, setOffset] = useState(0);
  const [passt, setPasst] = useState(null);
  let memoizedEvents = useMemo(() => AllEvents, [AllEvents]);
  memoizedEvents = memoizedEvents.filter(
    (el) =>
      new Date(el.date).toLocaleString("de-DE", {
        month: "long",
        day: "numeric",
      }) ===
      new Date(currentTime).toLocaleString("de-DE", {
        month: "long",
        day: "numeric",
      })
  );

  const containerRef = useRef(null);
  const scrollTimeout = useRef(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const scrollToCurrent = () => {
      if (hasScrolled.current || !containerRef.current) return;

      const currentCell = containerRef.current.querySelector(".now");

      if (currentCell) {
        currentCell.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "start",
        });
        hasScrolled.current = true;
      }
    };

    // Запускаем прокрутку после первого рендера
    scrollTimeout.current = setTimeout(scrollToCurrent, 300);

    return () => {
      clearTimeout(scrollTimeout.current);
    };
  }, []);
  const getRoundedTime = (date) => {
    const roundedDate = new Date(date);
    const minutes = roundedDate.getMinutes();
    const remainder = minutes % 5;
    roundedDate.setMinutes(minutes - remainder, 0, 0);
    return roundedDate;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Очистка при размонтировании компонента
  }, []);

  const findTimeCurrent = (hour, interval) => {
    const cellDate = new Date(currentTime);
    cellDate.setHours(hour, interval * 5, 0, 0);
    const isPast = cellDate < currentTime;
    const isNow = cellDate.getTime() === getRoundedTime(currentTime).getTime();
    return { isPast, isNow };
  };
  return (
    <div className="commonday" ref={containerRef}>
      {Array.from({ length: 24 }).map((_, hour) => {
        return (
          <div key={hour}>
            {Array.from({ length: 12 }).map((_, interval) => {
              const { isPast, isNow } = findTimeCurrent(hour, interval);
              // Фильтруем события для этой ячейки
              const cellEvents = memoizedEvents.filter((event) => {
                const eventDate = new Date(event.date);
                return (
                  eventDate.getHours() === hour &&
                  Math.floor(eventDate.getMinutes() / 5) === interval
                );
              });

              return (
                <div
                  key={interval}
                  className={`time ${isPast ? "past" : ""} ${interval === 0 ? "run" : ""} ${isNow ? "now" : ""}`}
                >
                  <span>{String(hour).padStart(2, "0")}:</span>
                  <span>{String(interval * 5).padStart(2, "0")}</span>

                  {/* Рендерим события для этой ячейки */}
                  <div className="events-container">
                    {cellEvents.map((el) => (
                      <Event
                        key={el._id}
                        id={el._id}
                        date={el.date}
                        content={el.content}
                        status={el.status}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CommonDay;
