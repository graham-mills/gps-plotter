import {
    EventBus,
    HidePositionGroupEvent,
    ShowPositionGroupEvent,
    PositionAddedEvent,
    PositionDeselectedEvent,
    PositionGroupAddedEvent,
    PositionGroupDeselectedEvent,
    PositionGroupRemovedEvent,
    PositionGroupSelectedEvent,
    PositionGroupUpdatedEvent,
    PositionRemovedEvent,
    PositionSelectedEvent,
    PositionSortedEvent,
    PositionUpdatedEvent,
} from "./events";
import { MapInterface } from "./map/map_interface";

/** This class performs operations to synchronise model state with the map state */
export class MapManager {
    map: MapInterface;

    constructor(eventBus: EventBus, map: MapInterface) {
        this.map = map;
        eventBus.subscribeToPositionAddedEvent(this.handlePositionAdded.bind(this));
        eventBus.subscribeToPositionRemovedEvent(this.handlePositionRemoved.bind(this));
        eventBus.subscribeToPositionGroupAddedEvent(
            this.handlePositionGroupAdded.bind(this)
        );
        eventBus.subscribeToPositionGroupRemovedEvent(
            this.handlePositionGroupRemoved.bind(this)
        );
        eventBus.subscribeToPositionSortedEvent(this.handlePositionSorted.bind(this));
        eventBus.subscribeToPositionSelectedEvent(
            this.handlePositionSelected.bind(this)
        );
        eventBus.subscribeToPositionDeselectedEvent(
            this.handlePositionDeselected.bind(this)
        );
        eventBus.subscribeToPositionGroupSelectedEvent(
            this.handlePositionGroupSelected.bind(this)
        );
        eventBus.subscribeToPositionGroupDeselectedEvent(
            this.handlePositionGroupDeselected.bind(this)
        );
        eventBus.subscribeToPositionUpdatedEvent(this.handlePositionUpdated.bind(this));
        eventBus.subscribeToPositionGroupUpdatedEvent(
            this.handlePositionGroupUpdated.bind(this)
        );
        eventBus.subscribeToHidePositionGroupEvent(
            this.handleHidePositionGroup.bind(this)
        );
        eventBus.subscribeToShowPositionGroupEvent(
            this.handleShowPositionGroup.bind(this)
        );
    }

    /** Adds the new position to the map */
    private handlePositionAdded(event: PositionAddedEvent): void {
        this.map.removePositionGroup(event.position.group!);
        this.map.addPositionGroup(event.position.group!);
    }

    /** Removes the position from the map */
    private handlePositionRemoved(event: PositionRemovedEvent): void {
        this.map.removePosition(event.position);
    }

    /** Adds the new position group to the map */
    private handlePositionGroupAdded(event: PositionGroupAddedEvent): void {
        this.map.addPositionGroup(event.group);
    }

    /** Removes the position group from the map */
    private handlePositionGroupRemoved(event: PositionGroupRemovedEvent): void {
        this.map.removePositionGroup(event.group);
    }

    /** Redraws the group the position is in, and optionally the group it was moved from */
    private handlePositionSorted(event: PositionSortedEvent): void {
        this.map.removePositionGroup(event.currentGroup);
        this.map.addPositionGroup(event.currentGroup);
        if (event) {
            this.map.removePositionGroup(event.previousGroup);
            this.map.addPositionGroup(event.previousGroup);
        }
    }

    /** Forwards event to the map to update the position's map marker */
    private handlePositionSelected(event: PositionSelectedEvent): void {
        this.map.positionSelected(event.position);
        this.map.focusOnPosition(event.position);
    }

    /** Forwards event to the map to update the position's map marker */
    private handlePositionDeselected(event: PositionDeselectedEvent) {
        this.map.positionDeselected(event.position);
    }

    /** Updates the map marker and group polyline for the updated position */
    private handlePositionUpdated(event: PositionUpdatedEvent) {
        this.map.removePosition(event.position);
        this.map.addPosition(event.position);
    }

    /** Updates all map markers and the polyline for the updated group */
    private handlePositionGroupUpdated(event: PositionGroupUpdatedEvent) {
        this.map.removePositionGroup(event.positionGroup);
        if (event.positionGroup.visible()) {
            this.map.addPositionGroup(event.positionGroup);
        }
    }

    /** Pans to the group and redraws a thicker polyline */
    private handlePositionGroupSelected(event: PositionGroupSelectedEvent) {
        this.map.focusOnPositionGroup(event.positionGroup);
        this.map.positionGroupSelected(event.positionGroup);
    }

    /** Redraws the polyline at normal thickness */
    private handlePositionGroupDeselected(event: PositionGroupDeselectedEvent) {
        this.map.positionGroupDeselected(event.positionGroup);
    }

    /** (Re)add position group to map */
    private handleShowPositionGroup(event: ShowPositionGroupEvent) {
        this.map.addPositionGroup(event.positionGroup);
    }

    /** Remove position group from map */
    private handleHidePositionGroup(event: HidePositionGroupEvent) {
        this.map.removePositionGroup(event.positionGroup);
    }
}
