import * as L from "leaflet";
import { AppConfig } from "../config";
import { Position } from "../model/position";
import { PositionGroup } from "../model/position_group";

export interface MapInterface {
    /** Add map marker for position. This will also adds the marker to the position group's polyline. */
    addPosition(position: Position): void;

    /** Add map markers for each position in group. This will also create a polyline connecting all positions in the group. */
    addPositionGroup(group: PositionGroup): void;

    /** Remove marker for position. This will also remove marker from group's polyline. */
    removePosition(position: Position): void;

    /** Remove map markers for each position in group. This will also remove the position group's polyline. */
    removePositionGroup(group: PositionGroup): void;

    /** Pan to (center on) a position */
    focusOnPosition(position: Position): void;

    /** Pan to (center on) a position group */
    focusOnPositionGroup(group: PositionGroup): void;

    /** Visually highlight the corresponding map marker for the selected position */
    positionSelected(position: Position): void;

    /** Remove any visual highlight from the corresponding map marker for the deselected position */
    positionDeselected(position: Position): void;

    /** Visually highlight the corresponding polyline for the selected group */
    positionGroupSelected(group: PositionGroup): void;

    /** Remove any visual highlight from the group's polyline */
    positionGroupDeselected(group: PositionGroup): void;

    /** Obtain lat/lng of center of view */
    getCenterLatLng(): [lat: number, lng: number];
}
