import { AppConfig } from "../config";
import * as ko from "knockout";

export class Position {
    latitude: ko.Observable<number>;
    longitude: ko.Observable<number>;

    constructor(latitude: number, longitude: number) {
        this.latitude = ko.observable(latitude);
        this.longitude = ko.observable(longitude);
    }
    toString() {
        return (
            this.latitude().toFixed(AppConfig.UI.LatLongPrecision) +
            ", " +
            this.longitude().toFixed(AppConfig.UI.LatLongPrecision)
        );
    }
}
