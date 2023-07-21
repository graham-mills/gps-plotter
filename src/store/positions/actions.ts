import { Position } from "../../model/position";
import { PositionGroup } from "../../model/position-group";

export interface AddPositionGroupPayload {
    group: PositionGroup;
}

export interface DeletePositionGroupPayload {
    groupId: string;
}

export interface AddPositionPayload {
    position: Position;
    insertionIndex?: number;
}

export interface AddPositionsPayload {
    positions: Position[];
}

export interface DeletePositionPayload {
    positionId: string;
}

export interface SelectPositionPayload {
    positionId: string;
}

export interface SelectPositionGroupPayload {
    groupId: string;
}

export interface UpdateGroupStatePayload {
    updatedGroup: PositionGroup;
}

export interface UpdatePositionStatePayload {
    updatedPosition: Position;
}

export interface SortPositionPayload {
    fromGroupId: string;
    toGroupId: string;
    fromIndex: number;
    toIndex: number;
    positionId: string;
}
