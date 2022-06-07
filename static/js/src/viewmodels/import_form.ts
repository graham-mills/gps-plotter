import {
    AddWaypointEvent,
    AddWaypointGroupEvent,
    EventBus,
    WaypointGroupAddedEvent,
    WaypointGroupRemovedEvent,
    WaypointGroupSelectedEvent,
    WaypointSelectedEvent,
} from "../events";
import * as ko from "knockout";
import { WaypointGroup } from "../model/waypoint_group";
import { AppConfig } from "../config";
import { Model } from "../model/model";
import { Waypoint } from "../model/waypoint";
import { waypoints_from_csv, ParseError } from "../csv_parse";

enum MappingOption {
    DefaultColumnMapping = 1,
    CustomColumnMapping = 2,
}

class FormData {
    importText = ko.observable<string>("");
    groupId = ko.observable<number>(0);
    errorMessages = ko.observableArray<string>();
    columnMappingOption = ko.observable(1);
    latitudeColName = ko.observable("latitude");
    longitudeColName = ko.observable("longitude");
    importTextPlaceholder = ko.computed(this.generatePlaceholderText.bind(this));

    private generatePlaceholderText(): string {
        let placeholder = "";
        if (this.columnMappingOption() == MappingOption.CustomColumnMapping) {
            placeholder =
                this.latitudeColName() + ", " + this.longitudeColName() + "\n";
        }
        placeholder += "48.858093, 2.294694";
        return placeholder;
    }
}

/** View Model for the HTML component `#import-form` */
export class ImportForm {
    eventBus: EventBus;
    model: Model;
    formData: FormData;

    constructor(eventBus: EventBus, model: Model) {
        this.formData = new FormData();
        this.model = model;
        this.eventBus = eventBus;
        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.ImportModal)
        );
    }

    // #region Knockout Bound Methods

    private importWaypoints() {
        this.reset();

        if (!this.validateForm()) {
            return;
        }

        try {
            const customLatitudeMapping =
                this.formData.columnMappingOption() == MappingOption.CustomColumnMapping
                    ? this.formData.latitudeColName()
                    : null;
            const customLongitudeMapping =
                this.formData.columnMappingOption() == MappingOption.CustomColumnMapping
                    ? this.formData.longitudeColName()
                    : null;

            const waypoints = waypoints_from_csv(
                this.formData.importText(),
                customLatitudeMapping,
                customLongitudeMapping
            );

            if (this.formData.groupId() == 0) {
                const group = WaypointGroup.makeUnique(waypoints);
                this.eventBus.publish(new AddWaypointGroupEvent(group));
            } else {
                waypoints.forEach((waypoint) => {
                    this.eventBus.publish(
                        new AddWaypointEvent(waypoint, this.formData.groupId())
                    );
                });
            }
            this.closeModal();
        } catch (error) {
            if (error instanceof ParseError) {
                this.formData.errorMessages.push(error.message);
                return;
            }
            throw error;
        }
    }

    // #endregion Knockout Bound Methods

    private closeModal() {}

    private validateForm(): boolean {
        if (this.formData.importText().trim().length == 0) {
            this.formData.errorMessages.push(
                "The field `CSV Data` cannot be left empty"
            );
            return false;
        }
        return true;
    }

    private reset() {
        this.formData.errorMessages.removeAll();
    }
}
