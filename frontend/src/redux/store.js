import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import socketReducer from "./reducers/socketReducer";
import eventsReducer from "./reducers/eventsReducer";
import { persistMiddleware } from "./middleware/persistMiddleware";
// =============================================
// =============================================
const rootReducer = combineReducers({
  socket: socketReducer,
  events: eventsReducer,
});
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : (f) => f;
// =============================================
const store = createStore(
  rootReducer,

  compose(
    devTools, // Добавляем поддержку Redux DevTools
    // Если у вас есть миддлвэры, их можно добавить здесь, например:
    // applyMiddleware(localStorageMiddleware)
    applyMiddleware(persistMiddleware)
  )
);
// ----------------------------------------------

export default store;
