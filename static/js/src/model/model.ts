import { AppConfig } from "../config";
import { WaypointGroup } from "./waypoint_group";
import * as ko from "knockout";

export class Model {
    waypointGroups: ko.ObservableArray<WaypointGroup>;

    constructor() {
        this.waypointGroups = ko.observableArray();
    }

    /** Returns `WaypointGroup` matching id, or null */
    public lookupGroupById(id: number) {
        for (let group of this.waypointGroups()) {
            if (group.id == id) {
                return group;
            }
        }
        return null;
    }

    /** Returns `Waypoint` matching id, or null */
    public lookupWaypointById(waypointId: number) {
        for (let group of this.waypointGroups()) {
            for (let wpt of group.waypoints()) {
                if (wpt.id == waypointId) {
                    return wpt;
                }
            }
        }
        return null;
    }

    /** Returns `WaypointGroup` containing waypoint with matching id, or null */
    public lookupGroupForWaypointId(id: number) {
        for (let group of this.waypointGroups()) {
            for (let wpt of group.waypoints()) {
                if (wpt.id == id) {
                    return group;
                }
            }
        }
        return null;
    }
}
