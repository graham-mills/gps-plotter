import { AppConfig } from "../config";
import {
    AddWaypointGroupEvent,
    EventBus,
    WaypointGroupAddedEvent,
    WaypointGroupRemovedEvent,
    WaypointGroupSelectedEvent,
} from "../events";
import * as ko from "knockout";
import { WaypointGroup } from "../model/waypoint_group";
import { RemoveWaypointGroupEvent } from "../events";

/** View Model for the HTML component `#controls` */
export class ControlsViewModel {
    eventBus: EventBus;
    waypointGroupIds: Set<number>;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.waypointGroupIds = new Set();

        eventBus.subscribeToWaypointGroupAddedEvent(
            this.handleWaypointGroupAdded.bind(this)
        );
        eventBus.subscribeToWaypointGroupRemovedEvent(
            this.handleWaypointGroupRemoved.bind(this)
        );

        ko.applyBindings(this, document.getElementById(AppConfig.DOMSymbols.Controls));
        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.ResetModal)
        );
    }

    // #region Internal Event Handlers

    private handleWaypointGroupAdded(event: WaypointGroupAddedEvent): void {
        this.waypointGroupIds.add(event.group.id);
    }

    private handleWaypointGroupRemoved(event: WaypointGroupRemovedEvent) {
        this.waypointGroupIds.delete(event.group.id);
    }

    // #endregion

    // #region Knockout Bound Methods

    private addEmptyGroup() {
        const group = WaypointGroup.makeUnique();
        this.eventBus.publish(new AddWaypointGroupEvent(group));
        this.eventBus.publish(new WaypointGroupSelectedEvent(group));
    }

    private deleteAllGroups() {
        this.waypointGroupIds.forEach((id: number) => {
            this.eventBus.publish(new RemoveWaypointGroupEvent(id));
        });
    }

    // #endregion
}
