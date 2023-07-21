import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_STATE } from "./state";
import { alertsReducers } from "./reducers";

const alertsSlice = createSlice({
    name: "alerts",
    initialState: INITIAL_STATE,
    reducers: alertsReducers,
});

export const alertsReducer = alertsSlice.reducer;
export const { showErrorAlert, showSuccessAlert, deleteAlert } = alertsSlice.actions;
export { type Alert, AlertType } from "./state";
