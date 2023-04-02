import { PositionGroup } from "../model/position_group";
import * as ko from "knockout";
import {
    EventBus,
    UpdatePositionGroupEvent,
    PositionGroupDeselectedEvent,
    PositionGroupSelectedEvent,
} from "../events";
import { AppConfig } from "../config";

/** View Model for the HTML component `#edit-position-group-form` */
export class EditPositionGroupForm {
    eventBus: EventBus;

    source: Optional<PositionGroup> = null;
    name: ko.Observable<string> = ko.observable("");
    drawPolyline: ko.Observable<boolean> = ko.observable(Boolean(false));
    showMarkers: ko.Observable<boolean> = ko.observable(Boolean(false));
    showMarkerLabels: ko.Observable<boolean> = ko.observable(Boolean(false));
    lineColor: ko.Observable<string> = ko.observable("#ffffff");
    showForm: ko.Observable<boolean> = ko.observable(Boolean(false));

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        eventBus.subscribeToPositionGroupSelectedEvent(
            this.handlePositionGroupSelected.bind(this)
        );
        eventBus.subscribeToPositionGroupDeselectedEvent(
            this.handlePositionGroupDeselected.bind(this)
        );

        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.EditGroupForm)
        );
    }

    private handlePositionGroupSelected(event: PositionGroupSelectedEvent) {
        this.populate(event.positionGroup);
        this.showForm(true);
    }

    private handlePositionGroupDeselected(event: PositionGroupDeselectedEvent) {
        this.showForm(false);
    }

    private populate(source: PositionGroup) {
        this.source = source;
        this.name(source.name());
        this.drawPolyline(source.drawPolyline());
        this.showMarkers(source.showMarkers());
        this.showMarkerLabels(source.showMarkerLabels());
        this.lineColor(source.lineColor());
    }

    private resetForm() {
        if (this.source) {
            this.populate(this.source);
        }
    }

    private submitForm() {
        if (!this.source) return;
        let updatedGroup = this.source;
        updatedGroup.name(this.name());
        updatedGroup.drawPolyline(this.drawPolyline());
        updatedGroup.showMarkers(this.showMarkers());
        updatedGroup.showMarkerLabels(this.showMarkerLabels());
        updatedGroup.lineColor(this.lineColor());
        this.eventBus.publish(new UpdatePositionGroupEvent(updatedGroup));
    }
}
