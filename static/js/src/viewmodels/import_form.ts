import { AddPositionEvent, AddPositionGroupEvent, EventBus } from "../events";
import * as ko from "knockout";
import { PositionGroup } from "../model/position_group";
import { AppConfig } from "../config";
import { Model } from "../model/model";
import { positionsFromCsv, ParseError } from "../csv_parse";
import * as bootstrap from "bootstrap";

enum MappingOption {
    DefaultColumnMapping = 1,
    CustomColumnMapping = 2,
}

enum FilteringOption {
    NoFiltering = 1,
    Downsample = 2,
}

class FormData {
    importText = ko.observable<string>("");
    groupId = ko.observable<number>(0);
    errorMessages = ko.observableArray<string>();
    columnMappingOption = ko.observable(1);
    latitudeColName = ko.observable("latitude");
    longitudeColName = ko.observable("longitude");
    importTextPlaceholder = ko.computed(this.generatePlaceholderText.bind(this));
    enableDownsampling = ko.observable<boolean>(false);
    filterSampleSize = ko.observable<number>(2);
    ordinalForSampleSize = ko.computed(this.generateOrdinalForSampleSize.bind(this));

    private generatePlaceholderText(): string {
        let placeholder = "";
        if (this.columnMappingOption() == MappingOption.CustomColumnMapping) {
            placeholder =
                this.latitudeColName() + ", " + this.longitudeColName() + "\n";
        }
        placeholder += "48.858093, 2.294694";
        return placeholder;
    }

    private generateOrdinalForSampleSize(): string {
        const j = this.filterSampleSize() % 10;
        const k = this.filterSampleSize() % 100;
        if (j == 1 && k != 11) {
            return "st";
        }
        if (j == 2 && k != 12) {
            return "nd";
        }
        if (j == 3 && k != 13) {
            return "rd";
        }
        return "th";
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

    private importPositions() {
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

            const filterSampleSize = this.formData.enableDownsampling()
                ? this.formData.filterSampleSize()
                : 1;

            const positions = positionsFromCsv(
                this.formData.importText(),
                customLatitudeMapping,
                customLongitudeMapping,
                filterSampleSize
            );

            const groupId = Number(this.formData.groupId());
            if (groupId == 0) {
                const group = PositionGroup.makeUnique(positions);
                this.eventBus.publish(new AddPositionGroupEvent(group));
            } else {
                positions.forEach((position) => {
                    this.eventBus.publish(new AddPositionEvent(position, groupId));
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

    private closeModal() {
        const element = document.getElementById(AppConfig.DOMSymbols.ImportModal);
        if (element) {
            bootstrap.Modal.getInstance(element)?.hide();
        }
    }

    private validateForm(): boolean {
        if (this.formData.importText().trim().length == 0) {
            this.formData.errorMessages.push(
                "The field `CSV Data` cannot be left empty"
            );
            return false;
        }
        if (
            this.formData.enableDownsampling() &&
            Number(this.formData.filterSampleSize() < 2)
        ) {
            this.formData.errorMessages.push(
                "The downsampling amount must be set to 2 or greater"
            );
            return false;
        }
        return true;
    }

    private reset() {
        this.formData.errorMessages.removeAll();
    }
}
