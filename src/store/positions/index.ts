import { createSlice } from "@reduxjs/toolkit";
import { positionsReducers } from "./reducers";
import { INITIAL_STATE } from "./state";

const positionsSlice = createSlice({
    name: "positions",
    initialState: INITIAL_STATE,
    reducers: positionsReducers,
});

export const positionsReducer = positionsSlice.reducer;
export const {
    deleteAllPositionsAndGroups,
    addPositionGroup,
    deletePositionGroup,
    addPosition,
    addPositions,
    deletePosition,
    selectPosition,
    selectPositionGroup,
    updateGroupState,
    updatePositionState,
    sortPosition,
} = positionsSlice.actions;

export { getSelectedGroup } from "./reducers";
export { getSelectedPosition } from "./reducers";
