import { AppConfig } from "../config";
import { Position } from "./position";
import * as ko from "knockout";

export class PositionGroup {
    static _idGenerator: number = 0;

    id: number;
    name: ko.Observable<string>;
    positions: ko.ObservableArray<Position>;
    visible: ko.Observable<boolean>;
    collapsed: ko.Observable<boolean>;
    lineColor: ko.Observable<string>;
    drawPolyline: ko.Observable<boolean>;
    selected: ko.Observable<boolean>;
    showMarkers: ko.Observable<boolean>;
    showMarkerLabels: ko.Observable<boolean>;

    constructor(id: number, positions: Array<Position>) {
        this.id = id;
        this.name = ko.observable(
            AppConfig.Model.DefaultGroupNamePrefix + String(this.id)
        );
        this.positions = ko.observableArray(positions);
        this.positions().forEach((wpt) => (wpt.group = this));
        this.visible = ko.observable(Boolean(true));
        this.collapsed = ko.observable(Boolean(false));
        this.selected = ko.observable(Boolean(false));
        this.showMarkers = ko.observable(Boolean(true));
        this.showMarkerLabels = ko.observable(Boolean(true));

        const colorIndex = this.id % AppConfig.Model.DefaultGroupColors.length;
        this.lineColor = ko.observable(AppConfig.Model.DefaultGroupColors[colorIndex]);
        this.drawPolyline = ko.observable(Boolean(true));
    }
    static makeUnique(positions: Array<Position> = []) {
        const id = ++PositionGroup._idGenerator;
        return new PositionGroup(id, positions);
    }
    addPosition(position: Position) {
        this.addPositionAtIndex(position, this.positions.length);
    }
    addPositionAtIndex(position: Position, index: number) {
        const exists = this.positions().find((wpt: Position) => wpt.id == position.id);
        if (!exists) {
            this.positions.splice(index, 0, position);
            position.group = this;
            position.showMapMarker(this.showMarkers());
            position.showMapMarkerLabel(this.showMarkerLabels());
        }
    }
    collapse() {
        this.collapsed(true);
    }
    expand() {
        this.collapsed(false);
    }
}
