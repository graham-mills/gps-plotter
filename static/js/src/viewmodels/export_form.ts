import { EventBus } from "../events";
import * as ko from "knockout";
import { AppConfig } from "../config";
import { Model } from "../model/model";
import { PositionGroup } from "../model/position_group";
import { Position } from "../model/position";

/** View Model for the HTML component `#export-form` */
export class ExportForm {
    eventBus: EventBus;
    model: Model;
    exportText = ko.observable("");
    copyButtonHtml = ko.observable("");

    constructor(eventBus: EventBus, model: Model) {
        this.model = model;
        this.eventBus = eventBus;
        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.ExportModal)
        );
        document
            .getElementById(AppConfig.DOMSymbols.ExportModal)
            ?.addEventListener("show.bs.modal", this.handleModalOpened.bind(this));
    }

    // #region Knockout Bound Methods

    private copyToClipboard() {
        navigator.clipboard.writeText(this.exportText());
        this.copyButtonHtml(`<i class="fa-solid fa-clipboard-check"></i> Copied!`);
    }

    // #endregion Knockout Bound Methods

    private handleModalOpened() {
        let csv = "group, position, latitude, longitude";
        this.model.positionGroups().forEach((group: PositionGroup) => {
            group.positions().forEach((position: Position) => {
                csv += `\n${group.name()}, ${position.name()}, ${position.latitude()}, ${position.longitude()}`;
            });
        });
        this.exportText(csv);
        this.copyButtonHtml(`<i class="fa-solid fa-clipboard"></i> Copy to Clipboard`);
    }
}
