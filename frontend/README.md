робот

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./Kalendar.scss";

const Kalendar = React.memo(() => {
const [events, setEvents] = useState([]);
const [newEvent, setNewEvent] = useState({ date: "", content: "", status: "pending" });

const socket = io("http://localhost:5000", {
path: "/socket.io",
});

// Получаем все события при подключении
useEffect(() => {
socket.emit("getAllEvents");

    socket.on("receiveAllEvents", (data) => {
      if (data.success) {
        setEvents(data.events);
      } else {
        console.error("Error fetching events:", data.error);
      }
    });

    socket.on("receiveEvent", (event) => {
      // Обновляем или добавляем событие
      setEvents((prevEvents) => {
        return prevEvents.map((e) =>
          e._id === event._id ? event : e
        );
      });
    });

    return () => {
      socket.off("receiveAllEvents");
      socket.off("receiveEvent");
    };

}, [socket]);

const handleAddEvent = () => {
socket.emit("sendEvent", newEvent);
setNewEvent({ date: "", content: "", status: "pending" }); // Очистить поля
};

const handleStatusChange = (id, newStatus) => {
socket.emit("changeStatus", { id, status: newStatus });
};

const handleEditEvent = (event) => {
socket.emit("editEvent", { \_id: event.\_id, content: event.content, date: event.date });
};

const handleDeleteEvent = (id) => {
socket.emit("deliteEvent", { id });
};

return (

<div className="kalendar">
<h1>Kalendar</h1>
<div className="kalendar-unit">
<h3>Januar</h3>
<div className="kalendar-month">
<div className="kalendar-line kalendar-line--header">
<div className="kalendar-day">Montag</div>
<div className="kalendar-day">Dienstag</div>
<div className="kalendar-day">Mittwoch</div>
<div className="kalendar-day">Donnerstag</div>
<div className="kalendar-day">Freitag</div>
<div className="kalendar-day">Samstag</div>
<div className="kalendar-day">Sonntag</div>
</div>
<div className="kalendar-line">
{events.map((event, index) => (
<div key={index} className="kalendar-day">
{event.date}
<p>{event.content}</p>
<button onClick={() => handleStatusChange(event.\_id, "completed")}>Complete</button>
<button onClick={() => handleEditEvent(event)}>Edit</button>
<button onClick={() => handleDeleteEvent(event.\_id)}>Delete</button>
</div>
))}
</div>
</div>

        <div className="add-event">
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          />
          <input
            type="text"
            placeholder="Event Content"
            value={newEvent.content}
            onChange={(e) => setNewEvent({ ...newEvent, content: e.target.value })}
          />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      </div>
    </div>

);
});

export default Kalendar;

import React, { useState } from "react";
import {
TextField,
MenuItem,
Select,
InputLabel,
FormControl,
Button,
} from "@mui/material";

function Regular() {
const [nameDay, setNameDay] = useState([
"Montag",
"Dienstag",
"Mittwoch",
"Donnerstag",
"Freitag",
"Samstag",
"Sonntag",
]);

const [dayName, setDayName] = useState("");
const [startData, setStartData] = useState("");
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [endData, setEndData] = useState("");

// Функции для обработки изменений
const handleDateChange = (event) => setStartData(event.target.value);
const handleTimeChange = (event) => setStartTime(event.target.value);
const handleEndTimeChange = (event) => setEndTime(event.target.value);
const handleEndDateChange = (event) => setEndData(event.target.value);

// Генерация временных опций с шагом в 5 минут
const generateTimeOptions = () => {
const times = [];
for (let i = 0; i < 24; i++) {
for (let j = 0; j < 60; j += 5) {
const hour = i.toString().padStart(2, "0");
const minute = j.toString().padStart(2, "0");
times.push(`${hour}:${minute}`);
}
}
return times;
};

// Функция для обработки отправки формы
const handleSubmit = (event) => {
event.preventDefault(); // Отменяем стандартное поведение формы
console.log("Form submitted:", {
dayName,
startData,
startTime,
endTime,
endData,
});
};

return (
<form onSubmit={handleSubmit}>
<div className="regular">
<div className="kalendar-line kalendar-line--header">
{nameDay &&
nameDay.map((el) => (
<div
key={el}
className={`header-day ${dayName === el ? "_run" : ""}`}
onClick={() => {
setDayName(el);
}} >
{el}
</div>
))}
</div>

        {/* Стартовые дата и время */}
        <div className="regular-start">
          <TextField
            label="Start Date"
            type="date"
            value={startData}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel id="start-time-select-label">Start Time</InputLabel>
            <Select
              labelId="start-time-select-label"
              id="start-time-select"
              value={startTime}
              onChange={handleTimeChange}
              label="Start Time"
            >
              {generateTimeOptions().map((time, index) => (
                <MenuItem key={index} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Время окончания */}
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel id="end-time-select-label">End Time</InputLabel>
            <Select
              labelId="end-time-select-label"
              id="end-time-select"
              value={endTime}
              onChange={handleEndTimeChange}
              label="End Time"
            >
              {generateTimeOptions().map((time, index) => (
                <MenuItem key={index} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Конечная дата */}
        <div className="regular-start">
          <TextField
            label="End Date"
            type="date"
            value={endData}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </div>

        {/* Кнопка Submit */}
        <div className="regular-start" style={{ marginTop: 20 }}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </div>
    </form>

);
}

export default Regular;

============================
import React, {
useState,
useEffect,
useMemo,
useCallback,
useRef,
useLayoutEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Kalendar.scss";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditEventModal from "./../EditEventModal/EditEventModal";
import AddEventForm from "../AddEventForm/AddEventForm";
import Event from "../Event/Event";
import useFormattedDate from "../../hooks/useFormattedDate";
import { Dialog, DialogContent } from "@mui/material";
import Regular from "../Regular/Regular";
import CurrentTime from "../CurrentTime/CurrentTime";
import CashEvent from "../CashEvent/CashEvent";
import Loading from "../Loading/Loading";
import KalendarLinia from "../KalendarLinia/KalendarLinia";
const Kalendar = React.memo(() => {
// const year = 2025;
// const [open, setOpen] = useState(false);
// const [transData, setTransData] = useState(null);
const AllEvents = useSelector((state) => state.events.events);
const memoizedEvents = useMemo(() => AllEvents, [AllEvents]);
const formattedDate = useFormattedDate(new Date());
// const location = useLocation();
const navigate = useNavigate();
const [clickedMonat, setclickedMonat] = useState(null);
// const queryParams = new URLSearchParams(location.search);
const [loading, setLoading] = useState(false);
const monthContainerRef = useRef(null);
//---//////////////////////////////////
// console.log("============------------memoizedEvents", memoizedEvents);
// const [monatNow, setMonatNow] = useState(new Date().getMonth());
const renderMonth = (num) => {
let month = Array.from(
{ length: 31 },
(\_, i) => new Date(2025, num, i + 1)
);
month = month.filter((el) => el.getMonth() === num);
let Monthname = month[0].toLocaleString("de-DE", { month: "long" });

    let MonthString = month.map((el) => {
      return el.toLocaleString("de-DE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    });

    let lear = [];
    // Рассчитываем отступы в зависимости от первого дня месяца
    if (MonthString[0].includes("Montag")) {
      lear = new Array(0).fill("");
    } else if (MonthString[0].includes("Dienstag")) {
      lear = new Array(1).fill("");
    } else if (MonthString[0].includes("Mittwoch")) {
      lear = new Array(2).fill("");
    } else if (MonthString[0].includes("Donnerstag")) {
      lear = new Array(3).fill("");
    } else if (MonthString[0].includes("Freitag")) {
      lear = new Array(4).fill("");
    } else if (MonthString[0].includes("Samstag")) {
      lear = new Array(5).fill("");
    } else if (MonthString[0].includes("Sonntag")) {
      lear = new Array(6).fill("");
    }

    let StringDay = [Monthname, ...lear, ...MonthString];
    // setLoading(false);
    return StringDay;

}; // Зависимости пустые, потому что результат функции зависит только от месяца

// const handelAdd = useCallback((dateString) => {
// console.log("dateString", dateString);
// setOpen(true);
// const months = [
// "Januar",
// "Februar",
// "März",
// "April",
// "Mai",
// "Juni",
// "Juli",
// "August",
// "September",
// "Oktober",
// "November",
// "Dezember",
// ];
// const currentYear = 2025;

// let [weekday, day, month] = dateString.split(" ");
// month = months.indexOf(month);

// if (month === -1) {
// console.error("Неверный месяц");
// } else {
// const date = new Date(currentYear, month, day);
// setTransData(new Date(date));
// }
// }, []);

// =================
const handelAdd = (hero) => {
const currentYear = 2025;

    // Преобразуем строку hero в дату с учетом года 2025
    const [weekday, day, month] = hero.split(", "); // Разделяем на части
    const [dayNumber, monthName] = day.split(" "); // Разделяем день и месяц

    // Составляем новую строку для создания даты
    const monthMap = {
      Januar: 0,
      Februar: 1,
      März: 2,
      April: 3,
      Mai: 4,
      Juni: 5,
      Juli: 6,
      August: 7,
      September: 8,
      Oktober: 9,
      November: 10,
      Dezember: 11,
    };

    const date = new Date(
      currentYear,
      monthMap[monthName],
      parseInt(dayNumber)
    );

    let formattedDate = date.toLocaleDateString("de-DE"); // Формат: "dd.MM.yyyy"

    // Навигация с датой в формате YYYY-MM-DD
    navigate(`/regular/${formattedDate}`);

};
// =================
const MonthNow = (i) => {
return (
new Date().toLocaleString("de-DE", {
month: "long",
}) === renderMonth(i)[0]
);
};
// =================

const getAllEventsForDay = (info) => {
const dateString = info + " 2025";
const monthsMap = {
Januar: 0,
Februar: 1,
März: 2,
April: 3,
Mai: 4,
Juni: 5,
Juli: 6,
August: 7,
September: 8,
Oktober: 9,
November: 10,
Dezember: 11,
};

    // Разбираем строку
    const regex = /([A-Za-zäöüß]+), (\d{1,2})\. (\w+) (\d{4})/;
    const match = dateString.match(regex);

    if (match) {
      const day = parseInt(match[2]); // 29
      const monthName = match[3]; // "März"
      const year = parseInt(match[4]); // 2025
      const month = monthsMap[monthName];
      const date = new Date(year, month, day).toLocaleString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      let currentDayEvents = [];

      currentDayEvents = memoizedEvents.filter((el) => {
        return (
          new Date(el.date).toLocaleString("de-DE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }) === date
        );
      });

      const renderCurrentDayEvents =
        currentDayEvents.length === 0
          ? null
          : currentDayEvents.map((hero, i) => (
              <Event
                key={hero._id}
                id={hero._id}
                date={hero.date}
                content={hero.content}
                status={hero.status}
              />
            ));

      return <>{renderCurrentDayEvents}</>;
    }

};
// ==============================
useLayoutEffect(() => {
if (monthContainerRef.current) {
// Если DOM для месяца был обновлен
setLoading(false); // Останавливаем лоадер
}
}, [clickedMonat]);
const renderClickedMonat = (i) => {
return (
<div
className="kalendar-unit--container"
style={{
          background: `${MonthNow(i) ? "rgb(255, 254, 201,.4)" : ""}`,
        }} >
<div className="kalendar-unit">
<KalendarLinia />
<div className="kalendar-line" key={i}>
{renderMonth(i)
.filter((el, index) => index !== 0)
.map((el, num) => (
<div
key={num}
className={`-day  ${el === formattedDate ? "day-now" : ""}  `}
style={{
                    background:
                      el === formattedDate
                        ? "#6B5F00"
                        : el === ""
                          ? "transparent"
                          : "rgba(255, 255, 255, 0.3960784314)",
                    outline: el === "" ? "none" : "",
                  }} >
<div
className={`day-info `}
style={{
                      color: el === formattedDate ? "#FFFEC9" : "",
                    }} >
{el !== "" ? (
<span
className="day-number"
onClick={() => {
// handelAdd(el);
handelAdd(el);
}} >
{el.replace(/\D/g, "")}
</span>
) : (
""
)}
</div>
{getAllEventsForDay(el)}
</div>
))}
</div>
</div>
</div>
);
};

// ==============================
const handelClickMonat = (i) => {
setLoading(true);
console.log("===--- i ---====", i);
setclickedMonat(i);
};
// ==============================
return (
<>
<Loading loading={loading}></Loading>
{/_ {loading && <div id="bootloader-text">loading...</div>} _/}
<div className={`kalendar`}>
{Array.from({ length: 12 }).map((_, i) => {
return (
<div
ref={i === clickedMonat ? monthContainerRef : null}
className="kalendar-unit--container"
style={{
                background: `${MonthNow(i) ? "rgb(255, 254, 201,.4)" : ""}`,
              }} >
<div className="month-name">
<h3
onClick={() => {
if (new Date().getMonth() !== i) {
handelClickMonat(i);
}
}}
style={{
                    background: `${MonthNow(i) ? "#6B5F00" : "#04286F"}`,
                  }} >
{renderMonth(i)[0]}
</h3>
</div>
{clickedMonat === i && renderClickedMonat(i)}
{MonthNow(i) && (
<div className="kalendar-unit">
<KalendarLinia />
<div className="kalendar-line" key={i}>
{renderMonth(i)
.filter((el, index) => index !== 0)
.map((el, num) => (
<div
key={num}
className={`-day  ${el === formattedDate ? "day-now" : ""}  `}
style={{
                            background:
                              el === formattedDate
                                ? "#6B5F00"
                                : el === ""
                                  ? "transparent"
                                  : "rgba(255, 255, 255, 0.3960784314)",
                            outline: el === "" ? "none" : "",
                          }} >
<div
className={`day-info `}
style={{
                              color: el === formattedDate ? "#FFFEC9" : "",
                            }} >
{el !== "" ? (
<span
className="day-number"
onClick={() => {
// handelAdd(el);
handelAdd(el);
}} >
{el.replace(/\D/g, "")}
</span>
) : (
""
)}
</div>
{getAllEventsForDay(el)}
</div>
))}
</div>
</div>
)}
</div>
);
})}
{/* <Regular transData={transData} openForm={open} setOpen={setOpen} /> */}
{/* {AllEvents &&
AllEvents.length > 0 &&
AllEvents.map((el) => (
<>
<p>
{new Date(el.date).toLocaleDateString("de-DE", {
weekday: "long",
day: "numeric",
month: "long",
})}
</p>
<p>
{el.events.map((foo, index) => (
<Event
                    key={index}
                    id={foo._id}
                    date={foo.date}
                    content={foo.content}
                    status={foo.status}
                  />
))}
</p>
</>
))} */}
{/\* {Array.from({ length: 12 }).map((_, i) => { _/}
{/_ const monthIndex = monatNow + i; _/}
{/_ return ( _/}
{/_ <section className="kalendar-month" key={i}>
<div className="month-name">
<h3>{renderMonth(i)[0]}</h3>
</div>
<div className="kalendar-line kalendar-line--header">
<div className="header-day">Montag</div>
<div className="header-day">Dienstag</div>
<div className="header-day">Mittwoch</div>
<div className="header-day">Donnerstag</div>
<div className="header-day">Freitag</div>
<div className="header-day">Samstag</div>
<div className="header-day">Sonntag</div>
</div>
<div className="kalendar-line" key={i}>
{renderMonth(i)
.filter((el, index) => index !== 0)
.map((el, num) => (
<div
key={num}
className="-day"
style={{
                    background:
                      el === formattedDate
                        ? // ? "rgb(79, 152, 188)"
                          "#6B5F00"
                        : el === ""
                          ? "transparent"
                          : "rgba(255, 255, 255, 0.3960784314)",
                    outline: el === "" ? "none" : "",
                  }} >
<div
className="day-info"
style={{
                      color: el === formattedDate ? "#FFFEC9" : "",
                    }} >
{el !== "" ? (
<span
className="day-number"
onClick={() => {
// handelAdd(el);
handelAdd(el);
}} >
{el.replace(/\D/g, "")}
</span>
) : (
""
)}
</div>
{getAllEventsForDay(el)}
</div>
))}
</div>
</section> _/}
{/_ ); _/}
{/_ })} \*/}
</div>
</>
);
});

export default Kalendar;
