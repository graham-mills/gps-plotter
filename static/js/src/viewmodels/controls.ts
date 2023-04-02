import { AppConfig } from "../config";
import {
    EventBus,
    AddPositionEvent,
    AddPositionGroupEvent,
    RemovePositionGroupEvent,
    PositionGroupAddedEvent,
    PositionGroupRemovedEvent,
    PositionGroupSelectedEvent,
    PositionGroupDeselectedEvent,
    PositionSelectedEvent,
    PositionDeselectedEvent,
} from "../events";
import * as ko from "knockout";
import { PositionGroup } from "../model/position_group";
import { Position } from "../model/position";
import { MapInterface } from "../map/map_interface";

/** View Model for the HTML component `#controls` */
export class ControlsViewModel {
    eventBus: EventBus;
    map: MapInterface;
    positionGroupIds: Set<number>;
    selectedGroup: Optional<PositionGroup>;
    selectedPosition: Optional<Position>;

    constructor(eventBus: EventBus, map: MapInterface) {
        this.eventBus = eventBus;
        this.map = map;
        this.positionGroupIds = new Set();
        this.selectedGroup = null;
        this.selectedPosition = null;

        eventBus.subscribeToPositionGroupAddedEvent(
            this.handlePositionGroupAdded.bind(this)
        );
        eventBus.subscribeToPositionGroupRemovedEvent(
            this.handlePositionGroupRemoved.bind(this)
        );
        eventBus.subscribeToPositionGroupSelectedEvent(
            this.handlePositionGroupSelected.bind(this)
        );
        eventBus.subscribeToPositionSelectedEvent(
            this.handlePositionSelected.bind(this)
        );
        eventBus.subscribeToPositionGroupDeselectedEvent(
            this.handlePositionGroupDeselected.bind(this)
        );
        eventBus.subscribeToPositionDeselectedEvent(
            this.handlePositionDeselected.bind(this)
        );

        ko.applyBindings(this, document.getElementById(AppConfig.DOMSymbols.Controls));
        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.ResetModal)
        );
    }

    // #region Internal Event Handlers

    private handlePositionGroupAdded(event: PositionGroupAddedEvent): void {
        this.positionGroupIds.add(event.group.id);
    }

    private handlePositionGroupRemoved(event: PositionGroupRemovedEvent) {
        this.positionGroupIds.delete(event.group.id);
    }

    private handlePositionGroupSelected(event: PositionGroupSelectedEvent) {
        this.selectedGroup = event.positionGroup;
    }

    private handlePositionGroupDeselected(event: PositionGroupDeselectedEvent) {
        this.selectedGroup = null;
    }

    private handlePositionSelected(event: PositionSelectedEvent) {
        this.selectedPosition = event.position;
    }

    private handlePositionDeselected(event: PositionDeselectedEvent) {
        this.selectedPosition = null;
    }

    // #endregion

    // #region Knockout Bound Methods

    private addEmptyGroup() {
        const group = PositionGroup.makeUnique();
        this.eventBus.publish(new AddPositionGroupEvent(group));
        this.eventBus.publish(new PositionGroupSelectedEvent(group));
    }

    private addPosition() {
        if (this.selectedPosition) {
            this.addPositionAfterPosition(this.selectedPosition);
        } else if (this.selectedGroup) {
            this.addPositionToEndOfGroup(this.selectedGroup);
        } else {
            this.addEmptyGroup();
            this.addPositionToEndOfGroup(this.selectedGroup!);
        }
    }

    private deleteAllGroups() {
        this.positionGroupIds.forEach((id: number) => {
            this.eventBus.publish(new RemovePositionGroupEvent(id));
        });
    }

    // #endregion

    private addPositionAfterPosition(prevPosition: Position) {
        // Move new position's position slightly to not sit on-top of previous position
        const newPosition = Position.makeUnique(
            prevPosition.latitude() + AppConfig.Model.NewPositionPositionOffset,
            prevPosition.longitude() + AppConfig.Model.NewPositionPositionOffset
        );
        const prevPositionIdx = prevPosition.group!.positions().indexOf(prevPosition);
        this.eventBus.publish(
            new AddPositionEvent(
                newPosition,
                prevPosition.group!.id,
                prevPositionIdx + 1
            )
        );
        this.eventBus.publish(new PositionSelectedEvent(newPosition));
    }

    private addPositionToEndOfGroup(positionGroup: PositionGroup) {
        const positionsLength = positionGroup.positions().length;
        if (positionsLength > 0) {
            this.addPositionAfterPosition(
                positionGroup.positions().at(positionsLength - 1)!
            );
        } else {
            const mapCenter = this.map.getCenterLatLng();
            const newPosition = Position.makeUnique(mapCenter[0], mapCenter[1]);
            this.eventBus.publish(new AddPositionEvent(newPosition, positionGroup.id));
            this.eventBus.publish(new PositionSelectedEvent(newPosition));
        }
    }
}
