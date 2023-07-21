import { PositionGroup } from "../../model/position-group";

export interface PositionsState {
    groups: { [id: string]: PositionGroup };
    positionIdToGroupId: { [id: string]: string };
    selectedGroupId: Optional<string>;
    selectedPositionId: Optional<string>;
}

export const INITIAL_STATE: PositionsState = {
    groups: {},
    positionIdToGroupId: {},
    selectedGroupId: null,
    selectedPositionId: null,
};
