import { AppConfig } from "../config";
import { Waypoint } from "./waypoint";
import * as ko from "knockout";

export class WaypointGroup {
    static _idGenerator: number = 0;

    id: number;
    name: ko.Observable<string>;
    waypoints: ko.ObservableArray<Waypoint>;
    visible: ko.Observable<boolean>;
    collapsed: ko.Observable<boolean>;
    lineColor: ko.Observable<string>;
    drawPolyline: ko.Observable<boolean>;
    showMarkers: ko.Observable<boolean>;
    selected: ko.Observable<boolean>;

    constructor(id: number, waypoints: Array<Waypoint>) {
        this.id = id;
        this.name = ko.observable(
            AppConfig.Model.DefaultGroupNamePrefix + String(this.id)
        );
        this.waypoints = ko.observableArray(waypoints);
        this.visible = ko.observable(Boolean(true));
        this.collapsed = ko.observable(Boolean(false));
        this.showMarkers = ko.observable(Boolean(true));
        this.selected = ko.observable(Boolean(false));

        const colorIndex = this.id % AppConfig.Model.DefaultGroupColors.length;
        this.lineColor = ko.observable(AppConfig.Model.DefaultGroupColors[colorIndex]);
        this.drawPolyline = ko.observable(Boolean(true));
    }
    static makeUnique(waypoints: Array<Waypoint> = []) {
        const id = ++WaypointGroup._idGenerator;
        return new WaypointGroup(id, waypoints);
    }
    addWaypoint(waypoint: Waypoint) {
        this.addWaypointAtIndex(waypoint, this.waypoints.length);
    }
    addWaypointAtIndex(waypoint: Waypoint, index: number) {
        const exists = this.waypoints().find((wpt: Waypoint) => wpt.id == waypoint.id);
        if (!exists) {
            this.waypoints.splice(index, 0, waypoint);
            waypoint.group = this;
        }
    }
    collapse() {
        this.collapsed(true);
    }
    expand() {
        this.collapsed(false);
    }
}
