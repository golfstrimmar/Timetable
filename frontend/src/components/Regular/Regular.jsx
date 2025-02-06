import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Regular.scss";
import { Button, Dialog, DialogContent } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  deliteEvent,
  sendEvent,
  sendEvents,
} from "../../redux/actions/eventsActions";
import TimeMinuts from "../TimeMinuts/TimeMinuts";
import GermanCalendar from "../GermanCalendar/GermanCalendar";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Loading from "../Loading/Loading";
const Regular = () => {
  // =====================
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const AllEvents = useSelector((state) => state.events.events);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(new Date());
  const [dayName, setDayName] = useState("");
  const [startUhr, setStartUhr] = useState("");
  const [startMinuts, setStartMinuts] = useState("");
  const [content, setContent] = useState("");

  const [formData, setFormData] = useState({
    date: startDate,
    content: "",
    status: false,
  });
  const [FinishDate, setFinishDate] = useState(new Date());
  const [alertMessage, setAlertMessage] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transData, setTransData] = useState(null);
  // =====================
  const { date } = useParams();
  // Например, выводим дату, которую извлекли из URL
  console.log("Дата из URL:", date); // Например, "31.01.2025"
  // Если нужно, можно преобразовать её в объект Date:
  // const [day, month, year] = date.split(".");
  // const formattedDate = new Date(`${year}-${month}-${day}`); // Преобразуем в объект Date
  // console.log("Дата как объект Date:", formattedDate);

  useEffect(() => {
    setTransData(date);
  }, [date]);
  // =====================

  const handleDateChange = (data) => {
    setStartDate(new Date(data));
  };

  const handleUhrChange = (data) => {
    setStartUhr(() => {
      return data;
    });
  };
  const handleMinutsChange = (data) => {
    setStartMinuts(() => {
      return data;
    });
  };
  const handleChangeContent = (value) => {
    setContent(value);
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };
  useEffect(() => {
    let dateObject = new Date(startDate);
    dateObject.setHours(startUhr);
    dateObject.setMinutes(startMinuts);
    setFormData((prev) => {
      return { ...prev, date: new Date(dateObject) };
    });
  }, [startUhr, startMinuts, startDate]);

  // ===============================
  function getDaysOfWeekAfterDate(SD, dayOfWeek) {
    const year = 2025;
    const days = [];

    // Начинаем с первого дня года
    let currentDate = new Date(year, 0, 1);

    // Находим первый день недели (dayOfWeek)
    let firstTargetDay =
      currentDate.getDay() <= dayOfWeek
        ? new Date(
            currentDate.setDate(
              currentDate.getDate() + (dayOfWeek - currentDate.getDay())
            )
          )
        : new Date(
            currentDate.setDate(
              currentDate.getDate() + (7 - currentDate.getDay() + dayOfWeek)
            )
          );

    // Если первый день недели после startDate, сдвигаем его на 7 дней
    if (firstTargetDay.getTime() <= SD.getTime()) {
      firstTargetDay.setDate(firstTargetDay.getDate() + 7); // Начинаем с дня недели, следующего после startDate
    }

    // Ищем все дни недели после startDate
    while (firstTargetDay.getFullYear() === year) {
      // Добавляем только те дни, которые больше чем SD
      if (firstTargetDay.getTime() > SD.getTime()) {
        days.push(new Date(firstTargetDay)); // Добавляем в массив
      }
      firstTargetDay.setDate(firstTargetDay.getDate() + 7); // Переходим к следующему нужному дню
    }

    return days;
  }
  const reliseFinish = (targetDays) => {
    let temp;
    if (FinishDate) {
      temp = new Date(FinishDate) - new Date(startDate);
    }

    if (targetDays.length > 0 && temp > 0) {
      targetDays = targetDays.filter((el) => {
        return el <= new Date(FinishDate);
      });
    }
    return targetDays;
  };
  const tempResponse = (response) => {
    const tempResponseDate = new Date(response.event.date).toLocaleString(
      "de-DE",
      {
        month: "long",
        day: "numeric",
      }
    );
    console.log("======tempResponseDate---", tempResponseDate);
    let newStorage = [...AllEvents];
    // let newStorage = localStorage.getItem("events");
    // newStorage = JSON.parse(newStorage);
    newStorage = newStorage.filter(
      (el) =>
        new Date(el.date).toLocaleString("de-DE", {
          month: "long",
          day: "numeric",
        }) === tempResponseDate
    );
    console.log(" ====----newStorage map", newStorage);
    return newStorage;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.content === "") {
      setAlertMessage(`?  content   ? `);
      setOpenMessage(true);
      setTimeout(() => {
        setOpenMessage(false);
        setAlertMessage("");
      }, 2000);
      return;
    }
    setLoading(true);
    let targetDays = [];
    if (dayName !== "") {
      const daysOfWeek = [
        "Sonntag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
      ];
      const dayOfWeek = daysOfWeek.indexOf(
        daysOfWeek.find((el) => {
          return el === dayName;
        })
      );
      console.log("==dayOfWeek==", dayOfWeek);
      targetDays = getDaysOfWeekAfterDate(formData.date, dayOfWeek);

      const d = new Date(formData.date);
      targetDays = reliseFinish(targetDays);
      // Извлекаем только время
      const time = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const [hours, minutes, seconds] = time.split(":");
      console.log("===targetDays====", targetDays);
      targetDays = targetDays.map((el) => {
        const newDate = new Date(el);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        newDate.setSeconds(seconds);
        let temp = { ...formData, date: newDate };
        return temp;
      });
      console.log("======targetDays=====", targetDays);
      if (socket) {
        socket.emit("sendEvents", targetDays);
        dispatch(sendEvents(targetDays));
      }

      socket.on("receiveEvents", (response) => {
        console.log("===+++==response:===+++==", response);
        if (response.success) {
          // dispatch(sendEvents(response.events));
          let newStorage = localStorage.getItem("events");
          newStorage = JSON.parse(newStorage);
          newStorage = [...newStorage, ...response.events];
          localStorage.setItem("events", JSON.stringify(newStorage));
          setStartDate(new Date());
          setOpenMessage(true);
          setAlertMessage("Events added successfully");
          setLoading(false);
          setTimeout(() => {
            setAlertMessage("");
            setContent("");
            setDayName("");
            setStartDate(new Date());
            setStartUhr("00");
            setStartMinuts("00");
            setFormData({
              date: startDate,
              content: "",
              status: false,
            });
            setOpenMessage(false);
            navigate(`/`);
          }, 2000);
        } else if (response.error) {
          setLoading(false);
          console.error("===Error from server====", response.error);
          setAlertMessage(response.error);
          // setOpen(false);
        }
      });
    } else {
      if (socket) {
        socket.emit("sendEvent", formData);
      }
      socket.on("receiveEvent", (response) => {
        if (response.success) {
          console.log("===+++==response:===+++==", response.event.date);
          dispatch(sendEvent(response.event));
          setTimeout(() => {
            setLoading(false);
            setOpenMessage(true);
            setAlertMessage("Event added succsessfuly");
          }, 1000);
          setTimeout(() => {
            setAlertMessage("");
            setContent("");
            setDayName("");
            setStartDate(new Date());
            setStartUhr("00");
            setStartMinuts("00");
            setFormData({
              date: startDate,
              content: "",
              status: false,
            });
            setOpenMessage(false);
            navigate(`/`);
          }, 2000);
          // let newStorage = tempResponse(response);
          // if (newStorage.length > 0) {
          // newStorage.push(response.event);

          // } else {
          // newStorage.push(response.event);
          // dispatch(sendEvent(response.event));
          // }
          // newStorage = newStorage.filter((el) => {
          //   return el.date === response.event.date;
          // });
          // console.log(" ====----newStorage filter", newStorage);
          // .push(response.event);
          // localStorage.setItem("events", JSON.stringify(newStorage));
          // console.log("====newStorage", newStorage);

          // setStartDate(new Date());
          // setOpenMessage(true);
          // setAlertMessage("Event added succsessfuly");
          // setTimeout(() => {
          //   setAlertMessage("");
          //   setContent("");
          //   setDayName("");
          //   setStartDate(new Date());
          //   setStartUhr("00");
          //   setStartMinuts("00");
          //   setFormData({
          //     date: startDate,
          //     content: "",
          //     status: false,
          //   });
          //   setOpenMessage(false);
          // }, 2000);
        } else if (response.error) {
          console.error("===Error from server====", response.error);
          setLoading(false);
          setAlertMessage(response.error);
          // setOpen(false);
        }
      });
    }
  };
  // ======================
  const [contentToDelite, setContentToDelite] = useState("");
  // const handleDelEv = (val) => {
  //   setContentToDelite(val);
  // };

  const handelGrupeRemove = () => {
    let newAllEvents = [...AllEvents];
    console.log("===--- contentToDelite ---====", contentToDelite);
    console.log("===--- newAllEvents ---====", newAllEvents);
    if (contentToDelite !== "" && newAllEvents.length > 0) {
      newAllEvents = newAllEvents.filter((el) =>
        el.content.includes(contentToDelite)
      );
      newAllEvents.forEach((el) => {
        if (socket) {
          socket.emit("deliteEvent", el._id);
          dispatch(deliteEvent(el._id));
          setOpenMessage(true);
          setAlertMessage("Event delitet ");
          setTimeout(() => {
            setOpenMessage(false);
            setAlertMessage("");
            setContentToDelite("");
            navigate(`/`);
          }, 5000);
        }
      });
    }
  };
  const createKalendar = (setFinishDate) => {
    if (dayName) {
      return <GermanCalendar setFinishDate={setFinishDate} />;
    }
  };
  // ======================
  const nameDay = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];
  // =====================
  return (
    <form onSubmit={handleSubmit} className="regularForm">
      <Loading loading={loading}></Loading>
      <Dialog open={openMessage} className="">
        <DialogContent>{alertMessage}</DialogContent>
      </Dialog>
      {/* <button
        type="button"
        className="klappen"
        onClick={() => {
          setOpen(false);
        }}
      >
        <ArrowDownward />
      </button> */}

      <div className="regular">
        <div className="kalendar-line kalendar-line--header">
          {nameDay &&
            nameDay.map((el, index) => (
              <div
                key={index}
                className={`header-day  ${dayName === el ? "_run" : ""} `}
                onClick={() => {
                  setDayName(el);
                }}
              >
                {el}
              </div>
            ))}
        </div>
        <div className="regular-start">
          <GermanCalendar
            handleDateChange={handleDateChange}
            transData={transData}
          />
          <section className="tablo">
            <div className="tablo-time">
              <TimeMinuts
                // title="Uhr"
                length={24}
                handleTimeChange={handleUhrChange}
                startUhr={startUhr}
              />
              <span>:</span>
              <TimeMinuts
                // title="Min"
                length={12}
                handleTimeChange={handleMinutsChange}
                startMinuts={startMinuts}
              />
            </div>
            <div className="startDate">
              <h3>Start</h3>
              <span>Tag Name:</span>
              <span className="-data">
                {dayName !== "" ? dayName + "s" : "-"}
              </span>
              <span>Zite:</span>
              <span className="-data">
                {startUhr}:{startMinuts}
              </span>
              <span>Ab:</span>
              <span className="-data">
                {startDate !== ""
                  ? startDate.toLocaleString("de-DE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
            {dayName && (
              <div className="startDate">
                <h3>Finish</h3>
                <span>bis:</span>
                <span className="-data">
                  {FinishDate !== ""
                    ? FinishDate?.toLocaleString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            )}
          </section>
          {createKalendar(setFinishDate)}
        </div>
        <input
          type="text"
          placeholder="Content"
          onChange={(e) => {
            handleChangeContent(e.target.value);
          }}
          value={content}
          className="Content-input"
        />
        <div className="klappen-buttons" style={{ marginTop: 20 }}>
          <Button
            className="klappen-buttons-button"
            type="button"
            variant="contained"
            onClick={() => {
              setAlertMessage("");
              setContent("");
              setDayName("");
              setStartDate(new Date());
              setStartUhr("00");
              setStartMinuts("00");
              setFormData({
                date: startDate,
                content: "",
                status: false,
              });
            }}
            style={{ marginRight: "20px" }}
          >
            <span className="addbuttons-icon ">🔙</span>
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            className="klappen-buttons-button"
          >
            <span className="addbuttons-icon ">💾</span>
          </Button>
        </div>

        <div className="danger-zone">
          <input
            type="text"
            placeholder="Content event to delite"
            onChange={(e) => {
              // handleDelEv(e.target.value);
              setContentToDelite(e.target.value);
            }}
            value={contentToDelite}
            className="Content-input"
          />
          <button
            type="button"
            onClick={() => {
              handelGrupeRemove();
            }}
          >
            ❌
          </button>
        </div>
      </div>
    </form>
  );
};

export default Regular;
