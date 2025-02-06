import { useMemo } from "react";

const useFormattedDate = (date) => {
  return useMemo(() => {
    return new Date(date)
      .toLocaleString("de-DE", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
      })
      .replace(/ 2025.*$/, "");
    // .replace(/(\d{1,2})\. Januar 2025 um \d{1,2}:\d{1,2}/g, (match, day) => {
    //   const paddedDay = day.padStart(2, "0");
    //   return `${paddedDay}`;
    // })
    // .replace(",", "");
  }, [date]);
};

export default useFormattedDate;
// возвращает --- Sonntag, 2. Februar
