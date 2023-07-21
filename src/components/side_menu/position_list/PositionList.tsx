import { SortableEvent } from "sortablejs";
import { Position } from "../../../model/position";
import { PositionGroup } from "../../../model/position-group";
import classes from "./PositionList.module.css";
import PositionListRow from "./PositionListRow";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { sortPosition } from "../../../store/positions";
import { ReactSortable } from "react-sortablejs";

export interface PositionListProps {
    group: PositionGroup;
    scrollToElement: (elementOffsetTop: number) => void;
}

const PositionList = ({ group, scrollToElement }: PositionListProps) => {
    const dispatch = useDispatch();
    const [sortables, setSortables] = useState<Array<Position>>(
        group.positions.map((pos) => ({ ...pos }))
    );

    useEffect(() => {
        setSortables(group.positions.map((pos) => ({ ...pos })));
    }, [group.positions]);

    const handleSortPosition = useCallback(
        (event: SortableEvent) => {
            const fromGroupId = event.from.id.substring("position-list-".length);
            // @ts-ignore: Deprecated property
            if (event.srcElement.id !== event.from.id) {
                return;
            }

            if (event.oldIndex === undefined || event.newIndex === undefined) {
                return;
            }

            dispatch(
                sortPosition({
                    fromGroupId: fromGroupId,
                    toGroupId: event.to.id.substring("position-list-".length),
                    fromIndex: event.oldIndex,
                    toIndex: event.newIndex,
                    positionId: event.item.id.substring("position-row-".length),
                })
            );
        },
        [dispatch]
    );

    return (
        <ReactSortable
            id={`position-list-${group.id}`}
            tag="ul"
            className={classes["position-list"]}
            group="shared"
            list={sortables}
            setList={setSortables}
            onSort={handleSortPosition}
            ghostClass={classes.ghost}
        >
            {sortables.map((pos: Position) => (
                <PositionListRow
                    key={`position-${pos.id}`}
                    position={pos}
                    scrollToElement={scrollToElement}
                />
            ))}
        </ReactSortable>
    );
};

export default PositionList;
