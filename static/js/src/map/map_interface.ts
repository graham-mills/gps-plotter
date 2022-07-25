import * as L from "leaflet";
import { AppConfig } from "../config";
import { Waypoint } from "../model/waypoint";
import { WaypointGroup } from "../model/waypoint_group";

export interface MapInterface {
    /** Add map marker for waypoint. This will also adds the marker to the waypoint group's polyline. */
    addWaypoint(waypoint: Waypoint): void;

    /** Add map markers for each waypoint in group. This will also create a polyline connecting all waypoints in the group. */
    addWaypointGroup(group: WaypointGroup): void;

    /** Remove marker for waypoint. This will also remove marker from group's polyline. */
    removeWaypoint(waypoint: Waypoint): void;

    /** Remove map markers for each waypoint in group. This will also remove the waypoint group's polyline. */
    removeWaypointGroup(group: WaypointGroup): void;

    /** Pan to (center on) a waypoint */
    focusOnWaypoint(waypoint: Waypoint): void;

    /** Pan to (center on) a waypoint group */
    focusOnWaypointGroup(group: WaypointGroup): void;

    /** Visually highlight the corresponding map marker for the selected waypoint */
    waypointSelected(waypoint: Waypoint): void;

    /** Remove any visual highlight from the corresponding map marker for the deselected waypoint */
    waypointDeselected(waypoint: Waypoint): void;

    /** Visually highlight the corresponding polyline for the selected group */
    waypointGroupSelected(group: WaypointGroup): void;

    /** Remove any visual highlight from the group's polyline */
    waypointGroupDeselected(group: WaypointGroup): void;

    /** Obtain lat/lng of center of view */
    getCenterLatLng(): [lat: number, lng: number];
}
