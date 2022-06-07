import {
    AddWaypointEvent,
    AddWaypointGroupEvent,
    EventBus,
    RemoveWaypointEvent,
    RemoveWaypointGroupEvent,
    WaypointAddedEvent,
    WaypointDeselectedEvent,
    WaypointGroupAddedEvent,
    WaypointGroupDeselectedEvent,
    WaypointGroupRemovedEvent,
    WaypointGroupSelectedEvent,
    WaypointGroupUpdatedEvent,
    WaypointRemovedEvent,
    WaypointSelectedEvent,
    WaypointSortedEvent,
    WaypointUpdatedEvent,
} from "./events";
import { MapInterface } from "./map/map_interface";

/** This class performs operations to synchronise model state with the map state */
export class MapManager {
    map: MapInterface;

    constructor(eventBus: EventBus, map: MapInterface) {
        this.map = map;
        eventBus.subscribeToWaypointAddedEvent(this.handleWaypointAdded.bind(this));
        eventBus.subscribeToWaypointRemovedEvent(this.handleWaypointRemoved.bind(this));
        eventBus.subscribeToWaypointGroupAddedEvent(
            this.handleWaypointGroupAdded.bind(this)
        );
        eventBus.subscribeToWaypointGroupRemovedEvent(
            this.handleWaypointGroupRemoved.bind(this)
        );
        eventBus.subscribeToWaypointSortedEvent(this.handleWaypointSorted.bind(this));
        eventBus.subscribeToWaypointSelectedEvent(
            this.handleWaypointSelected.bind(this)
        );
        eventBus.subscribeToWaypointDeselectedEvent(
            this.handleWaypointDeselected.bind(this)
        );
        eventBus.subscribeToWaypointGroupSelectedEvent(
            this.handleWaypointGroupSelected.bind(this)
        );
        eventBus.subscribeToWaypointGroupDeselectedEvent(
            this.handleWaypointGroupDeselected.bind(this)
        );
        eventBus.subscribeToWaypointUpdatedEvent(this.handleWaypointUpdated.bind(this));
        eventBus.subscribeToWaypointGroupUpdatedEvent(
            this.handleWaypointGroupUpdated.bind(this)
        );
    }

    /** Adds the new waypoint to the map */
    private handleWaypointAdded(event: WaypointAddedEvent): void {
        this.map.addWaypoint(event.waypoint);
    }

    /** Removes the waypoint from the map */
    private handleWaypointRemoved(event: WaypointRemovedEvent): void {
        this.map.removeWaypoint(event.waypoint, event.group);
    }

    /** Adds the new waypoint group to the map */
    private handleWaypointGroupAdded(event: WaypointGroupAddedEvent): void {
        this.map.addWaypointGroup(event.group);
    }

    /** Removes the waypoint group from the map */
    private handleWaypointGroupRemoved(event: WaypointGroupRemovedEvent): void {
        this.map.removeWaypointGroup(event.group);
    }

    /** Redraws the group the waypoint is in, and optionally the group it was moved from */
    private handleWaypointSorted(event: WaypointSortedEvent): void {
        this.map.removeWaypointGroup(event.currentGroup);
        this.map.addWaypointGroup(event.currentGroup);
        if (event) {
            this.map.removeWaypointGroup(event.previousGroup);
            this.map.addWaypointGroup(event.previousGroup);
        }
    }

    /** Forwards event to the map to update the waypoint's map marker */
    private handleWaypointSelected(event: WaypointSelectedEvent): void {
        this.map.waypointSelected(event.waypoint);
        this.map.focusOnWaypoint(event.waypoint);
    }

    /** Forwards event to the map to update the waypoint's map marker */
    private handleWaypointDeselected(event: WaypointDeselectedEvent) {
        this.map.waypointDeselected(event.waypoint);
    }

    /** Updates the map marker and group polyline for the updated waypoint */
    private handleWaypointUpdated(event: WaypointUpdatedEvent) {
        this.map.removeWaypoint(event.waypoint, event.waypoint.group!);
        this.map.addWaypoint(event.waypoint);
    }

    /** Updates all map markers and the polyline for the updated group */
    private handleWaypointGroupUpdated(event: WaypointGroupUpdatedEvent) {
        this.map.removeWaypointGroup(event.waypointGroup);
        this.map.addWaypointGroup(event.waypointGroup);
    }

    /** Pans to the group and redraws a thicker polyline */
    private handleWaypointGroupSelected(event: WaypointGroupSelectedEvent) {
        this.map.focusOnWaypointGroup(event.waypointGroup);
        this.map.waypointGroupSelected(event.waypointGroup);
    }

    /** Redraws the polyline at normal thickness */
    private handleWaypointGroupDeselected(event: WaypointGroupDeselectedEvent) {
        this.map.waypointGroupDeselected(event.waypointGroup);
    }
}
