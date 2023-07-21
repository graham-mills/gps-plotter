import { useDispatch, useSelector } from "react-redux";
import classes from "./Controls.module.css";
import { useCallback } from "react";
import {
    addPosition,
    addPositionGroup,
    deleteAllPositionsAndGroups,
    getSelectedGroup,
    getSelectedPosition,
    selectPosition,
    selectPositionGroup,
} from "../../../store/positions";
import { createPositionGroup } from "../../../model/position-group";
import { Position, createPosition } from "../../../model/position";
import store, { RootState } from "../../../store";
import { showSuccessAlert } from "../../../store/alerts";
import Button from "./Button";
import { AppConfig } from "../../../config";

const Controls = () => {
    const dispatch = useDispatch();
    const selectedGroupId = useSelector(
        (state: RootState) => state.positions.selectedGroupId
    );
    const selectedPositionId = useSelector(
        (state: RootState) => state.positions.selectedPositionId
    );

    const handleNewAddGroup = () => {
        const newGroup = createPositionGroup([]);
        dispatch(
            addPositionGroup({
                group: newGroup,
            })
        );
        dispatch(
            selectPositionGroup({
                groupId: newGroup.id,
            })
        );
    };

    const addNewPositionToSelectedGroup = useCallback((): Position => {
        const selectedGroup = getSelectedGroup(store.getState().positions);
        let position = null;
        if (selectedGroup.positions.length === 0) {
            // Add at map center
            position = createPosition(
                store.getState().map.center[0],
                store.getState().map.center[1]
            );
        } else {
            // Add after last position in group
            const tailPosition =
                selectedGroup.positions[selectedGroup.positions.length - 1];
            position = createPosition(
                Number(
                    (
                        tailPosition.latitude + AppConfig.NewPositionPositionOffset
                    ).toFixed(AppConfig.LatLongPrecision)
                ),
                Number(
                    (
                        tailPosition.longitude + AppConfig.NewPositionPositionOffset
                    ).toFixed(AppConfig.LatLongPrecision)
                )
            );
        }
        position.groupId = selectedGroup.id;
        dispatch(addPosition({ position }));
        return position;
    }, [dispatch]);

    const addNewPositionAfterSelectedPosition = useCallback((): Position => {
        const selectedPosition = getSelectedPosition(store.getState().positions);
        const selectedPositionIndex = store
            .getState()
            .positions.groups[selectedPosition.groupId!].positions.findIndex(
                (pos) => pos.id === selectedPosition.id
            );
        const position = createPosition(
            Number(
                (
                    selectedPosition.latitude + AppConfig.NewPositionPositionOffset
                ).toFixed(AppConfig.LatLongPrecision)
            ),
            Number(
                (
                    selectedPosition.longitude + AppConfig.NewPositionPositionOffset
                ).toFixed(AppConfig.LatLongPrecision)
            )
        );
        position.groupId = selectedPosition.groupId;
        dispatch(
            addPosition({
                position,
                insertionIndex: selectedPositionIndex + 1,
            })
        );
        return position;
    }, [dispatch]);

    const addNewPositionToNewGroup = useCallback((): Position => {
        const position = createPosition(
            store.getState().map.center[0],
            store.getState().map.center[1]
        );
        dispatch(
            addPositionGroup({
                group: createPositionGroup([position]),
            })
        );
        return position;
    }, [dispatch]);

    const handleAddNewPosition = () => {
        let position = null;
        if (selectedGroupId) {
            position = addNewPositionToSelectedGroup();
        } else if (selectedPositionId) {
            position = addNewPositionAfterSelectedPosition();
        } else {
            position = addNewPositionToNewGroup();
        }
        dispatch(
            selectPosition({
                positionId: position.id,
            })
        );
    };

    const handleDeleteAll = () => {
        dispatch(deleteAllPositionsAndGroups());
        dispatch(
            showSuccessAlert({
                message: "Removed all positions and groups",
            })
        );
    };

    return (
        <div className={`${classes.controls} btn-group mb-2`}>
            <Button
                iconClass="fa-vector-square"
                className="btn-success"
                title="Add a new position group"
                label="Add Group"
                onClick={handleNewAddGroup}
            />
            <Button
                iconClass="fa-location-dot"
                className="btn-success"
                title="Add a new position"
                label="Add Position"
                onClick={handleAddNewPosition}
            />
            <Button
                iconClass="fa-trash-can"
                className="btn-danger"
                title="Remove all positions and groups"
                label="Reset"
                onClick={handleDeleteAll}
            />
        </div>
    );
};

export default Controls;
