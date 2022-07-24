import {
    AddWaypointEvent,
    AddWaypointGroupEvent,
    EventBus,
    HideWaypointGroupEvent,
    RemoveWaypointEvent,
    RemoveWaypointGroupEvent,
    ShowWaypointGroupEvent,
    UpdateWaypointEvent,
    UpdateWaypointGroupEvent,
    WaypointAddedEvent,
    WaypointDeselectedEvent,
    WaypointGroupAddedEvent,
    WaypointGroupDeselectedEvent,
    WaypointGroupRemovedEvent,
    WaypointGroupSelectedEvent,
    WaypointGroupUpdatedEvent,
    WaypointRemovedEvent,
    WaypointSelectedEvent,
    WaypointUpdatedEvent,
} from "./events";
import { Model } from "./model/model";

/** Responsible for performing operations on the data model in response to any events. All modifications
 * to the data model should be performed through this interface.
 */
export class ModelManager {
    model: Model;
    eventBus: EventBus;

    constructor(eventBus: EventBus, model: Model) {
        this.model = model;
        this.eventBus = eventBus;
        eventBus.subscribeToAddWaypointEvent(this.handleAddWaypoint.bind(this));
        eventBus.subscribeToRemoveWaypointEvent(this.handleRemoveWaypoint.bind(this));
        eventBus.subscribeToAddWaypointGroupEvent(
            this.handleAddWaypointGroup.bind(this)
        );
        eventBus.subscribeToRemoveWaypointGroupEvent(
            this.handleRemoveWaypointGroup.bind(this)
        );
        eventBus.subscribeToWaypointSelectedEvent(
            this.handleWaypointSelected.bind(this)
        );
        eventBus.subscribeToWaypointGroupSelectedEvent(
            this.handleWaypointGroupSelected.bind(this)
        );
        eventBus.subscribeToWaypointDeselectedEvent(
            this.handleWaypointDeselected.bind(this)
        );
        eventBus.subscribeToWaypointGroupDeselectedEvent(
            this.handleWaypointGroupDeselected.bind(this)
        );
        eventBus.subscribeToUpdateWaypointEvent(this.handleUpdateWaypoint.bind(this));
        eventBus.subscribeToUpdateWaypointGroupEvent(
            this.handleUpdateWaypointGroup.bind(this)
        );
        eventBus.subscribeToShowWaypointGroupEvent(
            this.handleShowWaypointGroup.bind(this)
        );
        eventBus.subscribeToHideWaypointGroupEvent(
            this.handleHideWaypointGroup.bind(this)
        );
    }

    /** Adds a waypoint to an existing group. A group must be created before a waypoint can be added. */
    private handleAddWaypoint(event: AddWaypointEvent): void {
        const group = this.model.lookupGroupById(event.groupId)!;
        if (event.atIndex == null) {
            group.addWaypoint(event.waypoint);
        } else {
            group.addWaypointAtIndex(event.waypoint, event.atIndex!);
        }
        this.eventBus.publish(new WaypointAddedEvent(event.waypoint));
    }

    /** Removes a waypoint from the model */
    private handleRemoveWaypoint(event: RemoveWaypointEvent): void {
        let group = this.model.lookupGroupForWaypointId(event.waypointId)!;
        const waypoint = this.model.lookupWaypointById(event.waypointId)!;
        group.waypoints.remove(waypoint);
        this.eventBus.publish(new WaypointRemovedEvent(waypoint, group));
    }

    /** Adds a waypoint group to the model */
    private handleAddWaypointGroup(event: AddWaypointGroupEvent): void {
        this.model.waypointGroups.push(event.waypointGroup);
        this.eventBus.publish(new WaypointGroupAddedEvent(event.waypointGroup));
    }

    /** Removes a waypoint group from the model */
    private handleRemoveWaypointGroup(event: RemoveWaypointGroupEvent): void {
        const group = this.model.lookupGroupById(event.waypointGroupId)!;
        this.model.waypointGroups.remove(group);
        this.eventBus.publish(new WaypointGroupRemovedEvent(group));
    }

    /** Simply updates the object's 'selected' flag */
    private handleWaypointSelected(event: WaypointSelectedEvent): void {
        this.model.lookupWaypointById(event.waypoint.id)?.selected(true);
    }

    /** Simply updates the object's 'selected' flag */
    private handleWaypointGroupSelected(event: WaypointGroupSelectedEvent) {
        this.model.lookupGroupById(event.waypointGroup.id)?.selected(true);
    }

    /** Simply updates the object's 'selected' flag */
    private handleWaypointDeselected(event: WaypointDeselectedEvent): void {
        this.model.lookupWaypointById(event.waypoint.id)?.selected(false);
    }

    /** Simply updates the object's 'selected' flag */
    private handleWaypointGroupDeselected(event: WaypointGroupDeselectedEvent) {
        this.model.lookupGroupById(event.waypointGroup.id)?.selected(false);
    }

    /** Updates an existing waypoint's data */
    private handleUpdateWaypoint(event: UpdateWaypointEvent) {
        let waypoint = this.model.lookupWaypointById(event.updatedWaypoint.id)!;
        waypoint.name(event.updatedWaypoint.name());
        waypoint.position().latitude(event.updatedWaypoint.position().latitude());
        waypoint.position().longitude(event.updatedWaypoint.position().longitude());
        this.eventBus.publish(new WaypointUpdatedEvent(waypoint));
    }

    /** Updates an existing waypoint group's data (does not modify waypoint list) */
    private handleUpdateWaypointGroup(event: UpdateWaypointGroupEvent) {
        let group = this.model.lookupGroupById(event.updatedGroup.id)!;
        group.name(event.updatedGroup.name());
        group.drawPolyline(event.updatedGroup.drawPolyline());
        group.lineColor(event.updatedGroup.lineColor());
        group.selected(event.updatedGroup.selected());
        group.visible(event.updatedGroup.visible());
        group.collapsed(event.updatedGroup.collapsed());
        this.eventBus.publish(new WaypointGroupUpdatedEvent(group));
    }

    /** Updates group's visible flag to true */
    private handleShowWaypointGroup(event: ShowWaypointGroupEvent) {
        event.waypointGroup.visible(true);
    }

    /** Updates group's visible flag to false */
    private handleHideWaypointGroup(event: HideWaypointGroupEvent) {
        event.waypointGroup.visible(false);
    }
}
