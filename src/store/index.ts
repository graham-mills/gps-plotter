import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { alertsReducer } from "./alerts";
import { positionsReducer } from "./positions";
import { logger } from "./middleware/logger";
import { mapReducer } from "./map";

const rootReducer = combineReducers({
    alerts: alertsReducer,
    positions: positionsReducer,
    map: mapReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend([logger]),
});

export default store;
export type AppDispatch = typeof store.dispatch;
