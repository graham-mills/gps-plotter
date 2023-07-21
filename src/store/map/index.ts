import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";

export interface MapState {
    center: LatLngTuple;
}

const INITIAL_STATE: MapState = {
    center: [56.0705, -2.748201],
};

export interface UpdateCenterPayload {
    center: LatLngTuple;
}

const mapSlice = createSlice({
    name: "map",
    initialState: INITIAL_STATE,
    reducers: {
        updateCenter: (state, action: PayloadAction<UpdateCenterPayload>) => {
            state.center = action.payload.center;
        },
    },
});

export const mapReducer = mapSlice.reducer;
export const { updateCenter } = mapSlice.actions;
