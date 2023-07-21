import { Position } from "../../model/position";
import { PositionGroup, addPositionToGroup } from "../../model/position-group";
import {
    AddPositionGroupPayload,
    AddPositionPayload,
    AddPositionsPayload,
    DeletePositionGroupPayload,
    DeletePositionPayload,
    SelectPositionGroupPayload,
    SelectPositionPayload,
    SortPositionPayload,
    UpdateGroupStatePayload,
    UpdatePositionStatePayload,
} from "./actions";
import { PositionsState } from "./state";
import { PayloadAction } from "@reduxjs/toolkit";

export const positionsReducers = {
    // Adds a position group, including all of the group's positions
    addPositionGroup: (
        state: PositionsState,
        action: PayloadAction<AddPositionGroupPayload>
    ) => {
        const group = action.payload.group;
        state.groups[group.id] = group;
        group.positions.forEach((pos: Position) => {
            state.positionIdToGroupId[pos.id] = group.id;
        });
    },
    // Deletes a position group and all of its positions, deselecting the group or one of its
    // positions if they are currently selected
    deletePositionGroup: (
        state: PositionsState,
        action: PayloadAction<DeletePositionGroupPayload>
    ) => {
        const groupId = action.payload.groupId;
        if (state.selectedGroupId && state.selectedGroupId === groupId) {
            deselectGroup(state);
        }
        if (
            state.selectedPositionId &&
            lookupPositionById(state.selectedPositionId, state)!.groupId! === groupId
        ) {
            deselectPosition(state);
        }
        state.groups[groupId].positions.forEach((pos) => {
            delete state.positionIdToGroupId[pos.id];
        });
        delete state.groups[groupId];
    },
    // Adds a position to a group by its groupId property
    addPosition: (state: PositionsState, action: PayloadAction<AddPositionPayload>) => {
        const position = action.payload.position;
        addPositionToGroup(
            position,
            state.groups[position.groupId!],
            action.payload.insertionIndex
        );
        state.positionIdToGroupId[position.id] = position.groupId!;
    },
    // Adds multiple positions to groups by their groupId property
    addPositions: (
        state: PositionsState,
        action: PayloadAction<AddPositionsPayload>
    ) => {
        action.payload.positions.forEach((pos: Position) => {
            addPositionToGroup(pos, state.groups[pos.groupId!]);
            state.positionIdToGroupId[pos.id] = pos.groupId!;
        });
    },
    // Removes a position from its group using its groupId property, deselecting the position if
    // it is currently selected
    deletePosition: (
        state: PositionsState,
        action: PayloadAction<DeletePositionPayload>
    ) => {
        if (
            state.selectedPositionId &&
            state.selectedPositionId === action.payload.positionId
        ) {
            deselectPosition(state);
        }
        const position = lookupPositionById(action.payload.positionId, state)!;
        const group = state.groups[position.groupId!];
        const positionIndex = group.positions.findIndex(
            (pos) => pos.id === position.id
        );
        group.positions.splice(positionIndex, 1);
        delete state.positionIdToGroupId[action.payload.positionId];
    },
    // Removes all position groups (and their contained positions)
    deleteAllPositionsAndGroups: (state: PositionsState) => {
        deselectAll(state);
        state.groups = {};
        state.positionIdToGroupId = {};
    },
    // Marks a position as selected, deselecting any previously selected position or group
    // so that only one position/group can be selected at one time
    selectPosition: (
        state: PositionsState,
        action: PayloadAction<SelectPositionPayload>
    ) => {
        if (
            state.selectedPositionId &&
            state.selectedPositionId === action.payload.positionId
        ) {
            deselectPosition(state);
            return;
        }
        deselectAll(state);
        const position = lookupPositionById(action.payload.positionId, state)!;
        position.selected = true;
        state.selectedPositionId = position.id;
    },
    // Marks a group as selected, deselecting any previously selected position or group
    // so that only one position/group can be selected at one time
    selectPositionGroup: (
        state: PositionsState,
        action: PayloadAction<SelectPositionGroupPayload>
    ) => {
        if (state.selectedGroupId && state.selectedGroupId === action.payload.groupId) {
            deselectGroup(state);
            return;
        }
        deselectAll(state);
        const group = state.groups[action.payload.groupId];
        group.selected = true;
        state.selectedGroupId = group.id;
    },
    // Updates an existing group object - excluding its ID. The groups positions
    // are not updated except their showMapMarker and showMapMarkerLabel properties
    // to match the group.
    updateGroupState: (
        state: PositionsState,
        action: PayloadAction<UpdateGroupStatePayload>
    ) => {
        const updatedGroup = action.payload.updatedGroup;
        const storedGroup = state.groups[updatedGroup.id];
        storedGroup.collapsed = updatedGroup.collapsed;
        storedGroup.drawPolyline = updatedGroup.drawPolyline;
        storedGroup.lineColor = updatedGroup.lineColor;
        storedGroup.name = updatedGroup.name;
        storedGroup.selected = updatedGroup.selected;
        storedGroup.showMarkerLabels = updatedGroup.showMarkerLabels;
        storedGroup.showMarkers = updatedGroup.showMarkers;
        storedGroup.visible = updatedGroup.visible;
        storedGroup.positions.forEach((pos) => {
            pos.showMapMarker = storedGroup.showMarkers;
            pos.showMapMarkerLabel = storedGroup.showMarkerLabels;
        });
    },
    // Updates an existing position object - excluding its ID
    updatePositionState: (
        state: PositionsState,
        action: PayloadAction<UpdatePositionStatePayload>
    ) => {
        const updatedPosition = action.payload.updatedPosition;
        const storedPosition = lookupPositionById(updatedPosition.id, state)!;
        storedPosition.latitude = updatedPosition.latitude;
        storedPosition.longitude = updatedPosition.longitude;
        storedPosition.name = updatedPosition.name;
        storedPosition.selected = updatedPosition.selected;
        storedPosition.showMapMarker = updatedPosition.showMapMarker;
        storedPosition.showMapMarkerLabel = updatedPosition.showMapMarkerLabel;
    },
    // Moves a position from its current index in a group to another index in either the
    // same group or a different group
    sortPosition: (
        state: PositionsState,
        action: PayloadAction<SortPositionPayload>
    ) => {
        const fromGroup = state.groups[action.payload.fromGroupId];
        const toGroup = state.groups[action.payload.toGroupId];
        const fromIndex = action.payload.fromIndex;
        const toIndex = action.payload.toIndex;

        const position: Position = fromGroup.positions.find(
            (pos) => pos.id === action.payload.positionId
        )!;
        fromGroup.positions.splice(fromIndex, 1);
        toGroup.positions.splice(toIndex, 0, position);
        position.groupId = toGroup.id;
        state.positionIdToGroupId[position.id] = toGroup.id;
    },
};

/** Reducer helper functions **/

/** Attempts to lookup position by ID only */
const lookupPositionById = (
    posId: string,
    state: PositionsState
): Optional<Position> => {
    const group = state.groups[state.positionIdToGroupId[posId]];
    const foundPos = group.positions.find((pos) => pos.id === posId);
    return foundPos ? foundPos : null;
};

/** Find and return the currently selected group object, selected ID property must hold a value */
export const getSelectedGroup = (state: PositionsState): PositionGroup => {
    return state.groups[state.selectedGroupId!];
};

/** Find and return the currently selected position object, selected ID property must hold a value */
export const getSelectedPosition = (state: PositionsState): Position => {
    return lookupPositionById(state.selectedPositionId!, state)!;
};

/** Deselects the currently selected group, if one is selected */
const deselectGroup = (state: PositionsState) => {
    if (state.selectedGroupId) {
        state.groups[state.selectedGroupId].selected = false;
        state.selectedGroupId = null;
    }
};

/** Deselects the currently selected position, if one is selected */
const deselectPosition = (state: PositionsState): void => {
    if (state.selectedPositionId) {
        lookupPositionById(state.selectedPositionId, state)!.selected = false;
        state.selectedPositionId = null;
    }
};

/** Deselects any currently selected group or position */
const deselectAll = (state: PositionsState): void => {
    deselectGroup(state);
    deselectPosition(state);
};
