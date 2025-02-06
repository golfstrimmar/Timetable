export const persistMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Сохраняем состояние событий в localStorage
  const state = store.getState();
  if (state.events) {
    localStorage.setItem("events", JSON.stringify(state.events));
  }

  return result;
};
