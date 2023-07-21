import { useSelector } from "react-redux";
import classes from "./GroupList.module.css";
import GroupListRow from "./GroupListRow";
import { RootState } from "../../../store";
import PositionList from "../position_list/PositionList";
import { useCallback, useRef } from "react";

const GroupList = () => {
    const positionGroups = useSelector((state: RootState) => state.positions.groups);
    const groupListRef = useRef<HTMLDivElement>(null);

    const scrollToElement = useCallback(
        (elementOffsetTop: number) => {
            if (!groupListRef.current) {
                return;
            }
            // Scroll position is not changed using .scrollIntoView() as this
            // also scrolls the main window which makes the UI feel jumpy
            // and moves controls unnecessarily.
            // Instead the scrollTop value is manually adjusted to the top
            // of the selected element (offsetTop) minus half this element's
            // height to vertically center the selected element in the middle.
            // ScrollTop is not modified if the element is already in the view
            //
            const halfGroupListHeight = groupListRef.current.clientHeight / 2;
            const elementInView =
                elementOffsetTop > groupListRef.current.scrollTop &&
                elementOffsetTop <
                    groupListRef.current.scrollTop + groupListRef.current.clientHeight;
            if (elementInView) {
                return;
            }
            groupListRef.current.scrollTop = elementOffsetTop - halfGroupListHeight;
        },
        [groupListRef]
    );

    const groupRows = Object.keys(positionGroups).map((groupId: string) => (
        <div key={`${groupId}`}>
            <GroupListRow
                group={positionGroups[groupId]}
                scrollToElement={scrollToElement}
            />
            {!positionGroups[groupId].collapsed && (
                <PositionList
                    key={`${groupId}-positions`}
                    group={positionGroups[groupId]}
                    scrollToElement={scrollToElement}
                />
            )}
        </div>
    ));

    return (
        <div ref={groupListRef} className={`${classes["group-list"]}`}>
            {groupRows}
        </div>
    );
};

export default GroupList;
