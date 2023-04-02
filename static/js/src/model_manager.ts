import {
    AddPositionEvent,
    AddPositionGroupEvent,
    EventBus,
    HidePositionGroupEvent,
    RemovePositionEvent,
    RemovePositionGroupEvent,
    ShowPositionGroupEvent,
    UpdatePositionEvent,
    UpdatePositionGroupEvent,
    PositionAddedEvent,
    PositionDeselectedEvent,
    PositionGroupAddedEvent,
    PositionGroupDeselectedEvent,
    PositionGroupRemovedEvent,
    PositionGroupSelectedEvent,
    PositionGroupUpdatedEvent,
    PositionRemovedEvent,
    PositionSelectedEvent,
    PositionUpdatedEvent,
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
        eventBus.subscribeToAddPositionEvent(this.handleAddPosition.bind(this));
        eventBus.subscribeToRemovePositionEvent(this.handleRemovePosition.bind(this));
        eventBus.subscribeToAddPositionGroupEvent(
            this.handleAddPositionGroup.bind(this)
        );
        eventBus.subscribeToRemovePositionGroupEvent(
            this.handleRemovePositionGroup.bind(this)
        );
        eventBus.subscribeToPositionSelectedEvent(
            this.handlePositionSelected.bind(this)
        );
        eventBus.subscribeToPositionGroupSelectedEvent(
            this.handlePositionGroupSelected.bind(this)
        );
        eventBus.subscribeToPositionDeselectedEvent(
            this.handlePositionDeselected.bind(this)
        );
        eventBus.subscribeToPositionGroupDeselectedEvent(
            this.handlePositionGroupDeselected.bind(this)
        );
        eventBus.subscribeToUpdatePositionEvent(this.handleUpdatePosition.bind(this));
        eventBus.subscribeToUpdatePositionGroupEvent(
            this.handleUpdatePositionGroup.bind(this)
        );
        eventBus.subscribeToShowPositionGroupEvent(
            this.handleShowPositionGroup.bind(this)
        );
        eventBus.subscribeToHidePositionGroupEvent(
            this.handleHidePositionGroup.bind(this)
        );
    }

    /** Adds a position to an existing group. A group must be created before a position can be added. */
    private handleAddPosition(event: AddPositionEvent): void {
        const group = this.model.lookupGroupById(event.groupId)!;
        if (event.atIndex == null) {
            group.addPosition(event.position);
        } else {
            group.addPositionAtIndex(event.position, event.atIndex!);
        }
        this.eventBus.publish(new PositionAddedEvent(event.position));
    }

    /** Removes a position from the model */
    private handleRemovePosition(event: RemovePositionEvent): void {
        let group = this.model.lookupGroupForPositionId(event.positionId)!;
        const position = this.model.lookupPositionById(event.positionId)!;
        group.positions.remove(position);
        this.eventBus.publish(new PositionRemovedEvent(position));
    }

    /** Adds a position group to the model */
    private handleAddPositionGroup(event: AddPositionGroupEvent): void {
        this.model.positionGroups.push(event.positionGroup);
        this.eventBus.publish(new PositionGroupAddedEvent(event.positionGroup));
    }

    /** Removes a position group from the model */
    private handleRemovePositionGroup(event: RemovePositionGroupEvent): void {
        const group = this.model.lookupGroupById(event.positionGroupId)!;
        this.model.positionGroups.remove(group);
        this.eventBus.publish(new PositionGroupRemovedEvent(group));
    }

    /** Simply updates the object's 'selected' flag */
    private handlePositionSelected(event: PositionSelectedEvent): void {
        this.model.lookupPositionById(event.position.id)?.selected(true);
    }

    /** Simply updates the object's 'selected' flag */
    private handlePositionGroupSelected(event: PositionGroupSelectedEvent) {
        this.model.lookupGroupById(event.positionGroup.id)?.selected(true);
    }

    /** Simply updates the object's 'selected' flag */
    private handlePositionDeselected(event: PositionDeselectedEvent): void {
        this.model.lookupPositionById(event.position.id)?.selected(false);
    }

    /** Simply updates the object's 'selected' flag */
    private handlePositionGroupDeselected(event: PositionGroupDeselectedEvent) {
        this.model.lookupGroupById(event.positionGroup.id)?.selected(false);
    }

    /** Updates an existing position's data */
    private handleUpdatePosition(event: UpdatePositionEvent) {
        let position = this.model.lookupPositionById(event.updatedPosition.id)!;
        position.name(event.updatedPosition.name());
        position.latitude(event.updatedPosition.latitude());
        position.longitude(event.updatedPosition.longitude());
        this.eventBus.publish(new PositionUpdatedEvent(position));
    }

    /** Updates an existing position group's data (does not modify position list) */
    private handleUpdatePositionGroup(event: UpdatePositionGroupEvent) {
        let group = this.model.lookupGroupById(event.updatedGroup.id)!;
        group.name(event.updatedGroup.name());
        group.drawPolyline(event.updatedGroup.drawPolyline());
        group.lineColor(event.updatedGroup.lineColor());
        group.selected(event.updatedGroup.selected());
        group.visible(event.updatedGroup.visible());
        group.collapsed(event.updatedGroup.collapsed());
        this.eventBus.publish(new PositionGroupUpdatedEvent(group));
    }

    /** Updates group's visible flag to true */
    private handleShowPositionGroup(event: ShowPositionGroupEvent) {
        event.positionGroup.visible(true);
    }

    /** Updates group's visible flag to false */
    private handleHidePositionGroup(event: HidePositionGroupEvent) {
        event.positionGroup.visible(false);
    }
}
