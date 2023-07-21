import { useDispatch } from "react-redux";
import { PositionGroup } from "../../../model/position-group";
import classes from "./GroupListRow.module.css";
import {
    deletePositionGroup,
    selectPositionGroup,
    updateGroupState,
} from "../../../store/positions";
import { useEffect, useRef } from "react";
import Button from "../list/Button";
import Text from "../list/Text";
import DeleteButtonCell from "../list/DeleteButton";
import Column from "../list/Column";

export interface GroupListRowProps {
    group: PositionGroup;
    scrollToElement: (elementOffsetTop: number) => void;
}

const GroupListRow = ({ group, scrollToElement }: GroupListRowProps) => {
    const dispatch = useDispatch();

    const handleToggleCollapse = () => {
        dispatch(
            updateGroupState({
                updatedGroup: {
                    ...group,
                    collapsed: !group.collapsed,
                },
            })
        );
    };

    const handleToggleVisibility = () => {
        dispatch(
            updateGroupState({
                updatedGroup: {
                    ...group,
                    visible: !group.visible,
                },
            })
        );
    };

    const handleDelete = () => {
        dispatch(
            deletePositionGroup({
                groupId: group.id,
            })
        );
    };

    const handleRowSelected = () => {
        dispatch(selectPositionGroup({ groupId: group.id }));
    };

    const rowRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (group.selected && rowRef.current) {
            // Scroll to *center* of the row
            scrollToElement(rowRef.current.offsetTop + rowRef.current.clientHeight / 2);
        }
    }, [group.selected, scrollToElement]);

    return (
        <div
            ref={rowRef}
            className={`${classes["group-row"]} ${
                group.selected ? classes.selected : ""
            } row mx-auto no-gutter`}
            onClick={handleRowSelected}
            style={{ borderLeftColor: group.lineColor }}
        >
            <Column width={1}>
                <Button
                    iconClass={group.collapsed ? "fa-angle-right" : "fa-angle-down"}
                    title="Collapse/expand"
                    onClick={handleToggleCollapse}
                />
            </Column>
            <Column width={1}>
                <Button
                    iconClass={group.visible ? "fa-eye" : "fa-eye-slash"}
                    title="Toggle map visibility"
                    onClick={handleToggleVisibility}
                />
            </Column>
            <Column width={7}>
                <Text>
                    <b>{group.name}</b>
                </Text>
            </Column>
            <Column width={2}>
                <Text>
                    <i className="inline-icon fa-solid fa-location-dot"></i>
                    {group.positions.length}
                </Text>
            </Column>

            <Column width={1}>
                <DeleteButtonCell onClick={handleDelete} />
            </Column>
        </div>
    );
};

export default GroupListRow;
