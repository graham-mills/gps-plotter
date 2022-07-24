import { Waypoint } from "../model/waypoint";
import * as ko from "knockout";
import {
    EventBus,
    UpdateWaypointEvent,
    WaypointDeselectedEvent,
    WaypointSelectedEvent,
} from "../events";
import { AppConfig } from "../config";

/** View Model for the HTML component `#edit-waypoint-form` */
export class EditWaypointForm {
    eventBus: EventBus;

    name: ko.Observable<string> = ko.observable("");
    latitude: ko.Observable<number> = ko.observable(0.0);
    longitude: ko.Observable<number> = ko.observable(0.0);
    source: Optional<Waypoint> = null;
    showForm: ko.Observable<boolean> = ko.observable(Boolean(false));

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        eventBus.subscribeToWaypointSelectedEvent(
            this.handleWaypointSelected.bind(this)
        );
        eventBus.subscribeToWaypointDeselectedEvent(
            this.handleWaypointDeselected.bind(this)
        );

        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.EditWaypointForm)
        );
    }

    /** Populates the form for the selected waypoint and displays it */
    private handleWaypointSelected(event: WaypointSelectedEvent) {
        this.populate(event.waypoint);
        this.showForm(true);
    }

    /** Hides the form */
    private handleWaypointDeselected(event: WaypointDeselectedEvent) {
        this.showForm(false);
    }

    /** Populates form fields for a waypoint. The waypoint is kept as the 'source'. */
    private populate(waypoint: Waypoint) {
        this.source = waypoint;
        this.name(waypoint.name());
        this.latitude(waypoint.position().latitude());
        this.longitude(waypoint.position().longitude());
    }

    /** Reverts any changes to form data since the waypoint was selected */
    private resetForm() {
        if (this.source) {
            this.populate(this.source);
        }
    }

    /** Converts form data to an updated waypoint object and publishes update event */
    private submitForm() {
        if (!this.source) return;
        let updatedWaypoint = this.source;
        updatedWaypoint.name(this.name());
        updatedWaypoint.position().latitude(Number(this.latitude()));
        updatedWaypoint.position().longitude(Number(this.longitude()));
        this.eventBus.publish(new UpdateWaypointEvent(updatedWaypoint));
    }
}
