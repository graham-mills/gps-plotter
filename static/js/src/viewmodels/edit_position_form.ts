import { Position } from "../model/position";
import * as ko from "knockout";
import {
    EventBus,
    UpdatePositionEvent,
    PositionDeselectedEvent,
    PositionSelectedEvent,
} from "../events";
import { AppConfig } from "../config";

/** View Model for the HTML component `#edit-position-form` */
export class EditPositionForm {
    eventBus: EventBus;

    name: ko.Observable<string> = ko.observable("");
    latitude: ko.Observable<number> = ko.observable(0.0);
    longitude: ko.Observable<number> = ko.observable(0.0);
    source: Optional<Position> = null;
    showMapMarker: ko.Observable<boolean> = ko.observable(true);
    showMapMarkerLabel: ko.Observable<boolean> = ko.observable(true);
    showForm: ko.Observable<boolean> = ko.observable(Boolean(false));

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        eventBus.subscribeToPositionSelectedEvent(
            this.handlePositionSelected.bind(this)
        );
        eventBus.subscribeToPositionDeselectedEvent(
            this.handlePositionDeselected.bind(this)
        );

        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.EditPositionForm)
        );
    }

    /** Populates the form for the selected position and displays it */
    private handlePositionSelected(event: PositionSelectedEvent) {
        this.populate(event.position);
        this.showForm(true);
    }

    /** Hides the form */
    private handlePositionDeselected(event: PositionDeselectedEvent) {
        this.showForm(false);
    }

    /** Populates form fields for a position. The position is kept as the 'source'. */
    private populate(position: Position) {
        this.source = position;
        this.name(position.name());
        this.latitude(position.latitude());
        this.longitude(position.longitude());
        this.showMapMarker(position.showMapMarker());
        this.showMapMarkerLabel(position.showMapMarkerLabel());
    }

    /** Reverts any changes to form data since the position was selected */
    private resetForm() {
        if (this.source) {
            this.populate(this.source);
        }
    }

    /** Converts form data to an updated position object and publishes update event */
    private submitForm() {
        if (!this.source) return;
        let updatedPosition = this.source;
        updatedPosition.name(this.name());
        updatedPosition.latitude(Number(this.latitude()));
        updatedPosition.longitude(Number(this.longitude()));
        updatedPosition.showMapMarker(this.showMapMarker());
        updatedPosition.showMapMarkerLabel(this.showMapMarkerLabel());
        this.eventBus.publish(new UpdatePositionEvent(updatedPosition));
    }
}
