import { AppConfig } from "../config";
import { Position } from "./position";

let idGenerator: number = 0;

export interface PositionGroup {
    id: string;
    name: string;
    positions: Array<Position>;
    visible: boolean;
    collapsed: boolean;
    lineColor: string;
    drawPolyline: boolean;
    selected: boolean;
    showMarkers: boolean;
    showMarkerLabels: boolean;
}

/** Creates unique PositionGroup objects from an optional array of positions */
export const createPositionGroup = (positions: Array<Position> = []): PositionGroup => {
    const id = ++idGenerator;
    return {
        id: `group-${id}`,
        name: AppConfig.DefaultGroupNamePrefix + String(id),
        positions: positions.map((pos: Position) => {
            pos.groupId = `group-${id}`;
            return pos;
        }),
        visible: true,
        collapsed: false,
        selected: false,
        showMarkers: true,
        showMarkerLabels: true,
        lineColor:
            AppConfig.DefaultGroupColors[id % AppConfig.DefaultGroupColors.length],
        drawPolyline: true,
    };
};

/** Add a position to a group at the specified index. This also sets the group ID on the added position.  */
export const addPositionToGroup = (
    pos: Position,
    group: PositionGroup,
    index: Optional<number> = null
) => {
    pos.groupId = group.id;
    if (index) {
        group.positions.splice(index, 0, pos);
    } else {
        group.positions.push(pos);
    }
};
