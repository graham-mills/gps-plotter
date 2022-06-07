import { AppConfig } from "../config";
import { Position } from "./position";
import * as ko from "knockout";
import { WaypointGroup } from "./waypoint_group";

export class Waypoint {
    static _idGenerator: number = 0;

    public id: number;
    public group: Optional<WaypointGroup> = null;
    public name: ko.Observable<string>;
    public position: ko.Observable<Position>;
    public selected: ko.Observable<boolean>;

    constructor(id: number, position: Position) {
        this.id = id;
        this.name = ko.observable(
            AppConfig.Model.DefaultWaypointNamePrefix + String(this.id)
        );
        this.position = ko.observable(position);
        this.selected = ko.observable(Boolean(false));
    }
    toString(): string {
        return this.name() + ", " + this.position().toString();
    }
    static makeUnique(position: Position): Waypoint {
        const id = ++Waypoint._idGenerator;
        return new Waypoint(id, position);
    }
    static fromDecimalDegrees(latitude: number, longitude: number): Waypoint {
        return Waypoint.makeUnique(new Position(latitude, longitude));
    }
}
