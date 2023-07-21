import { PayloadAction } from "@reduxjs/toolkit";
import { AlertState, AlertType } from "./state";
import {
    DeleteAlertPayload,
    ShowErrorAlertPayload,
    ShowSuccessAlertPayload,
} from "./actions";

let idGenerator = 0;

export const alertsReducers = {
    showSuccessAlert: (
        state: AlertState,
        action: PayloadAction<ShowSuccessAlertPayload>
    ) => {
        state.alerts.push({
            id: `alert-${++idGenerator}`,
            type: AlertType.Success,
            message: action.payload.message,
            expired: false,
        });
    },
    showErrorAlert: (
        state: AlertState,
        action: PayloadAction<ShowErrorAlertPayload>
    ) => {
        state.alerts.push({
            id: `alert-${++idGenerator}`,
            type: AlertType.Error,
            message: action.payload.message,
            expired: false,
        });
    },
    deleteAlert: (state: AlertState, action: PayloadAction<DeleteAlertPayload>) => {
        const index = state.alerts.findIndex(
            (alert) => alert.id === action.payload.alertId
        );
        if (index > -1) {
            state.alerts.splice(index, 1);
        }
    },
};
