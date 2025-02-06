import React, { useState, useMemo } from "react";
import Event from "../Event/Event";
import "./CashEvent.scss";

// Компонент для отображения событий для конкретного дня
const CashEvent = ({ data }) => {
  // // Кэшируем события для каждого дня
  // const [cachedEvents, setCachedEvents] = useState(new Map());

  // // Если кеш для текущего дня уже существует, используем его, иначе фильтруем
  // const filteredEvents = useMemo(() => {
  //   if (el === "") return [];

  //   // Проверка на наличие кеша для текущего дня
  //   if (cachedEvents.has(el)) {
  //     return cachedEvents.get(el);
  //   }

  //   // Если в кеше нет данных, фильтруем события для текущего дня
  //   const filtered = memoizedEvents?.filter((event) => {
  //     const eventDay = new Date(event.date).toLocaleString("de-DE", {
  //       weekday: "long",
  //       day: "numeric",
  //       month: "long",
  //     });

  //     return eventDay === el;
  //   });

  //   // Сохраняем отфильтрованные события в кеше
  //   setCachedEvents((prevCache) => {
  //     const newCache = new Map(prevCache);
  //     newCache.set(el, filtered);
  //     return newCache;
  //   });

  //   return filtered;
  // }, [el, memoizedEvents, cachedEvents]);

  // if (el === "") return null;

  return (
    <div>
      <p>{data}</p>

      {/* <p>{new Date(data).toLocaleDateString("de-DE")}</p> */}
      {/* <Event
          key={i}
          id={foo._id}
          date={foo.date}
          content={foo.content}
          status={foo.status}
          actuel={true}
        /> */}
    </div>
  );
};

export default CashEvent;
