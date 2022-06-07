import { WaypointGroup } from "../model/waypoint_group";
import * as ko from "knockout";
import {
    EventBus,
    UpdateWaypointGroupEvent,
    WaypointGroupDeselectedEvent,
    WaypointGroupSelectedEvent,
} from "../events";
import { AppConfig } from "../config";

/** View Model for the HTML component `#edit-waypoint-group-form` */
export class EditWaypointGroupForm {
    eventBus: EventBus;

    source: Optional<WaypointGroup> = null;
    name: ko.Observable<string> = ko.observable("");
    drawPolyline: ko.Observable<boolean> = ko.observable(Boolean(false));
    showMarkers: ko.Observable<boolean> = ko.observable(Boolean(false));
    lineColor: ko.Observable<string> = ko.observable("#ffffff");
    showForm: ko.Observable<boolean> = ko.observable(Boolean(false));

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;

        eventBus.subscribeToWaypointGroupSelectedEvent(
            this.handleWaypointGroupSelected.bind(this)
        );
        eventBus.subscribeToWaypointGroupDeselectedEvent(
            this.handleWaypointGroupDeselected.bind(this)
        );

        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.EditGroupForm)
        );
    }

    private handleWaypointGroupSelected(event: WaypointGroupSelectedEvent) {
        this.populate(event.waypointGroup);
        this.showForm(true);
    }

    private handleWaypointGroupDeselected(event: WaypointGroupDeselectedEvent) {
        this.showForm(false);
    }

    private populate(source: WaypointGroup) {
        this.source = source;
        this.name(source.name());
        this.drawPolyline(source.drawPolyline());
        this.showMarkers(source.showMarkers());
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
        updatedGroup.lineColor(this.lineColor());
        this.eventBus.publish(new UpdateWaypointGroupEvent(updatedGroup));
    }
}
