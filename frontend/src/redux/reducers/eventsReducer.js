const initialState = {
  events: [],
  // events: JSON.parse(localStorage.getItem("events")) ||
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ALL_EVENTS":
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          events: action.payload.sort((a, b) => {
            const dateA = new Date(a.date); // Преобразуем строку в объект Date
            const dateB = new Date(b.date); // Преобразуем строку в объект Date
            return dateA - dateB; // Сортируем по возрастанию
          }),
        };
      } else {
        console.error("Payload is not an array", action.payload);
        return state; // Если payload не массив, возвращаем прежнее состояние
      }
    // return {
    //   ...state,
    //   events: action.payload.sort((a, b) => {
    //     const dateA = new Date(a.date); // Убедимся, что dateA - это объект Date
    //     const dateB = new Date(b.date); // Убедимся, что dateB - это объект Date
    //     return dateA - dateB; // Сортировка по возрастанию
    //   }),
    // };
    case "SEND_EVENTS":
      let newSEND = [...state.events, ...action.payload];
      return {
        ...state,
        events: newSEND.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        }),
      };
    case "SEND_EVENT":
      let newSENDEvents = [...state.events, action.payload];
      // let newStorage = localStorage.getItem("events");
      // newStorage = JSON.parse(newStorage);
      // newStorage = [...newStorage, action.payload];
      // localStorage.setItem("events", JSON.stringify(newStorage));
      return {
        ...state,
        events: newSENDEvents.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        }),
      };
    case "UPDATE_STATUS_EVENT":
      let newEvents = [...state.events];
      newEvents = newEvents.map((el) => {
        if (el._id === action.payload._id) {
          return { ...el, status: action.payload.status };
        }
        return el;
      });
      return {
        ...state,
        events: newEvents,
      };
    case "EDIT_EVENT":
      let newEDITEvents = [...state.events];
      newEDITEvents = newEDITEvents.map((el) => {
        if (el._id === action.payload._id) {
          return action.payload;
        }
        return el;
      });
      return {
        ...state,
        events: newEDITEvents.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        }),
      };
    case "DELITE_EVENT":
      let newDELITEEvents = [...state.events];
      newDELITEEvents = newDELITEEvents.filter((el) => {
        return el._id !== action.payload;
      });
      return {
        ...state,
        events: newDELITEEvents.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        }),
      };

    default:
      return state;
  }
};
export default eventsReducer;
