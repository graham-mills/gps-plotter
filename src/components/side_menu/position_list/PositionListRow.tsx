import { useDispatch } from "react-redux";
import { AppConfig } from "../../../config";
import { Position } from "../../../model/position";
import classes from "./PositionListRow.module.css";
import DeleteButton from "../list/DeleteButton";
import { deletePosition, selectPosition } from "../../../store/positions";
import { useEffect, useRef } from "react";
import TextCell from "../list/Text";
import Column from "../list/Column";
import Button from "../list/Button";

export interface PositionListRowProps {
    position: Position;
    scrollToElement: (positionFromTop: number) => void;
}

const PositionListRow = ({ position, scrollToElement }: PositionListRowProps) => {
    const dispatch = useDispatch();

    const handleRowSelected = () => {
        dispatch(
            selectPosition({
                positionId: position.id,
            })
        );
    };

    const handleDelete = () => {
        dispatch(
            deletePosition({
                positionId: position.id,
            })
        );
    };

    const rowRef = useRef<HTMLLIElement>(null);
    useEffect(() => {
        if (position.selected && rowRef.current) {
            // Scroll to the *center* of the row
            scrollToElement(rowRef.current.offsetTop + rowRef.current.clientHeight / 2);
        }
    }, [position.selected, scrollToElement]);

    const latLongText = `${position.latitude.toFixed(
        AppConfig.LatLongPrecision
    )}, ${position.longitude.toFixed(AppConfig.LatLongPrecision)}`;

    return (
        <li
            ref={rowRef}
            id={`position-row-${position.id}`}
            className={`${classes["position-row"]} row no-gutter ${
                position.selected ? classes.selected : ""
            }`}
            onClick={handleRowSelected}
        >
            <Column width={1}>{/* Spacer */}</Column>
            <Column width={1}>
                <Button
                    iconClass={`fa-grip-lines ${classes.handle}`}
                    title="Re-order position"
                    onClick={() => {}}
                />
            </Column>
            <Column width={3}>
                <TextCell>{position.name}</TextCell>
            </Column>
            <Column width={6}>
                <TextCell>{latLongText}</TextCell>
            </Column>
            <Column width={1}>
                <DeleteButton onClick={handleDelete} />
            </Column>
        </li>
    );
};

export default PositionListRow;
