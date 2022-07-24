import { AppConfig } from "../config";
import {
    EventBus,
    AddWaypointEvent,
    AddWaypointGroupEvent,
    RemoveWaypointGroupEvent,
    WaypointGroupAddedEvent,
    WaypointGroupRemovedEvent,
    WaypointGroupSelectedEvent,
    WaypointGroupDeselectedEvent,
    WaypointSelectedEvent,
    WaypointDeselectedEvent,
} from "../events";
import * as ko from "knockout";
import { WaypointGroup } from "../model/waypoint_group";
import { Waypoint } from "../model/waypoint";
import { MapInterface } from "../map/map_interface";
import { Position } from "../model/position";

/** View Model for the HTML component `#controls` */
export class ControlsViewModel {
    eventBus: EventBus;
    map: MapInterface;
    waypointGroupIds: Set<number>;
    selectedGroup: Optional<WaypointGroup>;
    selectedWaypoint: Optional<Waypoint>;

    constructor(eventBus: EventBus, map: MapInterface) {
        this.eventBus = eventBus;
        this.map = map;
        this.waypointGroupIds = new Set();
        this.selectedGroup = null;
        this.selectedWaypoint = null;

        eventBus.subscribeToWaypointGroupAddedEvent(
            this.handleWaypointGroupAdded.bind(this)
        );
        eventBus.subscribeToWaypointGroupRemovedEvent(
            this.handleWaypointGroupRemoved.bind(this)
        );
        eventBus.subscribeToWaypointGroupSelectedEvent(
            this.handleWaypointGroupSelected.bind(this)
        );
        eventBus.subscribeToWaypointSelectedEvent(
            this.handleWaypointSelected.bind(this)
        );
        eventBus.subscribeToWaypointGroupDeselectedEvent(
            this.handleWaypointGroupDeselected.bind(this)
        );
        eventBus.subscribeToWaypointDeselectedEvent(
            this.handleWaypointDeselected.bind(this)
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

    private handleWaypointGroupSelected(event: WaypointGroupSelectedEvent) {
        this.selectedGroup = event.waypointGroup;
    }

    private handleWaypointGroupDeselected(event: WaypointGroupDeselectedEvent) {
        this.selectedGroup = null;
    }

    private handleWaypointSelected(event: WaypointSelectedEvent) {
        this.selectedWaypoint = event.waypoint;
    }

    private handleWaypointDeselected(event: WaypointDeselectedEvent) {
        this.selectedWaypoint = null;
    }

    // #endregion

    // #region Knockout Bound Methods

    private addEmptyGroup() {
        const group = WaypointGroup.makeUnique();
        this.eventBus.publish(new AddWaypointGroupEvent(group));
        this.eventBus.publish(new WaypointGroupSelectedEvent(group));
    }

    private addWaypoint() {
        if (this.selectedWaypoint) {
            this.addWaypointAfterWaypoint(this.selectedWaypoint);
        } else if (this.selectedGroup) {
            this.addWaypointToEndOfGroup(this.selectedGroup);
        } else {
            this.addEmptyGroup();
            this.addWaypointToEndOfGroup(this.selectedGroup!);
        }
    }

    private deleteAllGroups() {
        this.waypointGroupIds.forEach((id: number) => {
            this.eventBus.publish(new RemoveWaypointGroupEvent(id));
        });
    }

    // #endregion

    private addWaypointAfterWaypoint(prevWaypoint: Waypoint) {
        // Move new waypoint's position slightly to not sit on-top of previous waypoint
        const newWaypoint = Waypoint.makeUnique(
            new Position(
                prevWaypoint.position().latitude() +
                    AppConfig.Model.NewWaypointPositionOffset,
                prevWaypoint.position().longitude() +
                    AppConfig.Model.NewWaypointPositionOffset
            )
        );
        const prevWaypointIdx = prevWaypoint.group!.waypoints().indexOf(prevWaypoint);
        this.eventBus.publish(
            new AddWaypointEvent(
                newWaypoint,
                prevWaypoint.group!.id,
                prevWaypointIdx + 1
            )
        );
        this.eventBus.publish(new WaypointSelectedEvent(newWaypoint));
    }

    private addWaypointToEndOfGroup(waypointGroup: WaypointGroup) {
        const waypointsLength = waypointGroup.waypoints().length;
        if (waypointsLength > 0) {
            this.addWaypointAfterWaypoint(
                waypointGroup.waypoints().at(waypointsLength - 1)!
            );
        } else {
            const mapCenter = this.map.getCenterLatLng();
            const newWaypoint = Waypoint.makeUnique(
                new Position(mapCenter[0], mapCenter[1])
            );
            this.eventBus.publish(new AddWaypointEvent(newWaypoint, waypointGroup.id));
            this.eventBus.publish(new WaypointSelectedEvent(newWaypoint));
        }
    }
}
