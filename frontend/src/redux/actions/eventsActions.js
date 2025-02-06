export const setAllEvents = (events) => ({
  type: "SET_ALL_EVENTS",
  payload: events,
});
export const updateStatusEvent = (el) => ({
  type: "UPDATE_STATUS_EVENT",
  payload: el,
});
export const editEvent = (el) => ({
  type: "EDIT_EVENT",
  payload: el,
});
export const sendEvent = (el) => ({
  type: "SEND_EVENT",
  payload: el,
});
export const sendEvents = (elements) => ({
  type: "SEND_EVENTS",
  payload: elements,
});
export const deliteEvent = (id) => ({
  type: "DELITE_EVENT",
  payload: id,
});
