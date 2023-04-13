import { AppConfig } from "../config";
import * as ko from "knockout";
import { PositionGroup } from "./position_group";

export class Position {
    static _idGenerator: number = 0;

    public id: number;
    public group: Optional<PositionGroup> = null;
    public name: ko.Observable<string>;
    public selected: ko.Observable<boolean>;
    public latitude: ko.Observable<number>;
    public longitude: ko.Observable<number>;
    public showMapMarker: ko.Observable<boolean>;
    public showMapMarkerLabel: ko.Observable<boolean>;

    constructor(id: number, latitude: number, longitude: number) {
        this.id = id;
        this.name = ko.observable(
            AppConfig.Model.DefaultPositionNamePrefix + String(this.id)
        );
        this.latitude = ko.observable(latitude);
        this.longitude = ko.observable(longitude);
        this.selected = ko.observable(Boolean(false));
        this.showMapMarker = ko.observable(Boolean(true));
        this.showMapMarkerLabel = ko.observable(Boolean(true));
    }
    toString(): string {
        return this.name() + ", " + this.latLongString();
    }
    latLongString(): string {
        return (
            this.latitude().toFixed(AppConfig.UI.LatLongPrecision) +
            ", " +
            this.longitude().toFixed(AppConfig.UI.LatLongPrecision)
        );
    }
    static makeUnique(latitude: number, longitude: number): Position {
        const id = ++Position._idGenerator;
        return new Position(id, latitude, longitude);
    }
    static fromDecimalDegrees(latitude: number, longitude: number): Position {
        return Position.makeUnique(latitude, longitude);
    }
}
