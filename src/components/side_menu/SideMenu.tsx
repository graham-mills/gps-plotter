import Controls from "./controls/Controls";
import classes from "./SideMenu.module.css";
import EditPositionForm from "./edit_position/EditPositionForm";
import GroupList from "./group_list/GroupList";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Fragment } from "react";
import Panel from "./Panel";
import EditGroupForm from "./edit_group/EditGroupForm";
import EditGroupToggles from "./edit_group/EditGroupToggles";
import { getSelectedGroup, getSelectedPosition } from "../../store/positions";

const SideMenu = () => {
    const selectedGroup = useSelector((state: RootState) =>
        state.positions.selectedGroupId ? getSelectedGroup(state.positions) : null
    );
    const selectedPosition = useSelector((state: RootState) =>
        state.positions.selectedPositionId ? getSelectedPosition(state.positions) : null
    );

    return (
        <div className={`${classes["side-menu"]} col-xxl-4 resp-padding`}>
            <Controls />
            <Panel>
                <GroupList />
            </Panel>

            {selectedGroup && (
                <Fragment>
                    <Panel>
                        <EditGroupForm group={selectedGroup} />
                    </Panel>
                    <Panel>
                        <EditGroupToggles group={selectedGroup} />
                    </Panel>
                </Fragment>
            )}
            {selectedPosition && (
                <Panel>
                    <EditPositionForm position={selectedPosition} />
                </Panel>
            )}
        </div>
    );
};

export default SideMenu;
