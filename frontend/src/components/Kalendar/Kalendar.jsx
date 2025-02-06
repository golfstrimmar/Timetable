import React, { useState, useMemo, useCallback } from "react";
import Event from "../Event/Event";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Kalendar.scss";
import "./KalendarDeep.scss";
const GERMAN_MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const Kalendar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const AllEvents = useSelector((state) => state.events.events);
  // =========================================
  // 1. Создаем хеш-мап для мгновенного доступа к событиям по дате
  const eventsMap = useMemo(() => {
    const map = new Map();

    AllEvents.forEach((event) => {
      try {
        // 1.1. Парсим дату с проверкой типа
        const date =
          event.date instanceof Date ? event.date : new Date(event.date);

        // 1.2. Валидация даты
        if (isNaN(date)) {
          console.warn("Invalid date in event:", event);
          return;
        }

        // 1.3. Нормализация даты (без времени)
        const normalizedDate = new Date(
          Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
        );

        // 1.4. Создаем ключ в формате YYYY-MM-DD
        const dateKey = normalizedDate.toISOString().slice(0, 10);

        // 1.5. Добавляем в мап
        if (!map.has(dateKey)) {
          map.set(dateKey, []);
        }

        map.get(dateKey).push({
          ...event,
          originalDate: date, // Сохраняем оригинальный объект Date
          timestamp: date.getTime(), // Для быстрой сортировки
        });
      } catch (e) {
        console.error("Error processing event:", event, e);
      }
    });

    // 1.6. Сортируем события внутри каждого дня
    map.forEach((events) => {
      events.sort((a, b) => a.timestamp - b.timestamp);
    });

    return map;
  }, [AllEvents]);
  const getEventsForDate = useCallback(
    (day) => {
      if (!day || selectedMonth === null) return [];
      const utcDate = new Date(Date.UTC(2025, selectedMonth, day));
      const dateKey = utcDate.toISOString().slice(0, 10);
      return eventsMap.get(dateKey) || [];
    },
    [selectedMonth, eventsMap]
  );
  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, []);
  // 1. Мемоизация вычислений дней
  const getMonthDays = useCallback((monthIndex) => {
    const year = 2025;
    const firstDay = new Date(year, monthIndex, 1);
    const firstDayOffset = (firstDay.getDay() + 6) % 7; // Пн=0, Вс=6
    return {
      monthName: GERMAN_MONTHS[monthIndex],
      days: [
        ...Array(firstDayOffset).fill(null),
        ...Array.from(
          { length: new Date(year, monthIndex + 1, 0).getDate() },
          (_, i) => i + 1
        ),
      ],
    };
  }, []);

  const handelAdd = (hero) => {
    navigate(`/regular/${hero}`);
  };
  const findDayname = (day) => {
    const el = new Date(2025, selectedMonth, day);
    return el.toLocaleString("de-DE", {
      weekday: "long",
    });
  };
  // 2. Оптимизированный рендер дней
  const renderDays = useMemo(() => {
    if (selectedMonth === null) return null;
    const { days } = getMonthDays(selectedMonth);

    return days.map((day, index) => {
      const dayEvents = getEventsForDate(day);
      return (
        <div
          key={`${selectedMonth}-${index}`}
          className={`day ${day ? "active" : "empty"}`}
          style={{
            backgroundColor: `${
              new Date(2025, selectedMonth, day).toLocaleString("de-DE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) ===
              new Date().toLocaleString("de-DE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
                ? "#61B1F1"
                : ""
            }`,
          }}
        >
          <div className="head-day">
            <div
              onClick={() => {
                const el = new Date(2025, selectedMonth, day);
                handelAdd(el);
              }}
              className={`${day ? "day-number" : ""}`}
            >
              {day || ""}
            </div>
            <div className="day-name">{findDayname(day)}</div>{" "}
          </div>
          {dayEvents.length > 0 && (
            <div className="events-container">
              {dayEvents.map((event) => (
                <Event
                  key={event._id}
                  id={event._id}
                  date={event.date}
                  content={event.content}
                  status={event.status}
                />
              ))}
            </div>
          )}
        </div>
      );
    });
  }, [selectedMonth, getMonthDays, getEventsForDate, formatTime]);

  return (
    <div className="kalendar-container">
      {/* Месяцы */}
      <div className="months-grid">
        {GERMAN_MONTHS.map((month, index) => (
          <button
            key={month}
            className={`month-button ${
              selectedMonth === index ? "selected" : ""
            }`}
            onClick={() => setSelectedMonth(index)}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Дни */}
      {selectedMonth !== null && (
        <div className="days-grid">
          <h3>{GERMAN_MONTHS[selectedMonth]}</h3>
          <div className="weekdays">
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="days">{renderDays}</div>
        </div>
      )}
    </div>
  );
};
export default Kalendar;
