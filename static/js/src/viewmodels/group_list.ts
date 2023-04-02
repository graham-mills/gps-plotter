import { Model } from "../model/model";
import { Position } from "../model/position";
import { PositionGroup } from "../model/position_group";
import * as ko from "knockout";
import {
    EventBus,
    HidePositionGroupEvent,
    RemovePositionEvent,
    RemovePositionGroupEvent,
    ShowPositionGroupEvent,
    PositionDeselectedEvent,
    PositionGroupDeselectedEvent,
    PositionGroupHtmlRenderedEvent,
    PositionGroupRemovedEvent,
    PositionGroupSelectedEvent,
    PositionRemovedEvent,
    PositionSelectedEvent,
} from "../events";
import { AppConfig } from "../config";

/** View Model for the HTML component `#group-list`  */
export class GroupList {
    eventBus: EventBus;
    model: Model;
    selectedGroup: Optional<PositionGroup>;
    selectedPosition: Optional<Position>;

    constructor(eventBus: EventBus, model: Model) {
        this.eventBus = eventBus;
        this.model = model;
        this.selectedGroup = null;
        this.selectedPosition = null;

        eventBus.subscribeToPositionSelectedEvent(
            this.handlePositionSelected.bind(this)
        );
        eventBus.subscribeToPositionGroupSelectedEvent(
            this.handlePositionGroupSelected.bind(this)
        );
        eventBus.subscribeToPositionRemovedEvent(this.handlePositionRemoved.bind(this));
        eventBus.subscribeToPositionGroupRemovedEvent(
            this.handlePositionGroupRemoved.bind(this)
        );

        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.PositionGroupList)
        );
    }

    //#region Knockout Bound Methods

    private positionGroupHtmlRendered(groupId: number) {
        this.eventBus.publish(new PositionGroupHtmlRenderedEvent(groupId));
    }

    private hidePositionGroup(groupId: number) {
        const group = this.model.lookupGroupById(groupId)!;
        this.eventBus.publish(new HidePositionGroupEvent(group));
    }

    private showPositionGroup(groupId: number) {
        const group = this.model.lookupGroupById(groupId)!;
        this.eventBus.publish(new ShowPositionGroupEvent(group));
    }

    private deletePosition(positionId: number) {
        this.eventBus.publish(new RemovePositionEvent(positionId));
    }

    private deletePositionGroup(groupId: number) {
        this.eventBus.publish(new RemovePositionGroupEvent(groupId));
    }

    private selectGroupById(groupId: number) {
        if (this.selectedGroup?.id == groupId) return;
        const positionGroup = this.model.lookupGroupById(groupId)!;
        this.deselectAll();
        this.selectedGroup = positionGroup;
        this.eventBus.publish(new PositionGroupSelectedEvent(positionGroup));
    }

    private selectPositionById(positionId: number) {
        if (this.selectedPosition?.id == positionId) return;
        const position = this.model.lookupPositionById(positionId)!;
        this.deselectAll();
        this.selectedPosition = position;
        this.eventBus.publish(new PositionSelectedEvent(position));
    }

    // #endregion

    // #region Internal Event Handlers

    // Positions may be selected by other components in addition to
    // this one. For example, on clicking a map marker. We must check
    // if we have selected each item already to avoid generating
    // unncesssary deselect/select events.

    private handlePositionSelected(event: PositionSelectedEvent) {
        if (this.selectedPosition?.id == event.position.id) return;
        this.deselectAll();
        this.selectedPosition = event.position;
        document
            .getElementById(AppConfig.DOMSymbols.PositionRowPrefix + event.position.id)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    private handlePositionGroupSelected(event: PositionGroupSelectedEvent) {
        if (this.selectedGroup?.id == event.positionGroup.id) return;
        this.deselectAll();
        this.selectedGroup = event.positionGroup;
    }

    private handlePositionRemoved(event: PositionRemovedEvent) {
        if (this.selectedPosition && this.selectedPosition.id == event.position.id) {
            this.deselectPosition();
        }
    }

    private handlePositionGroupRemoved(event: PositionGroupRemovedEvent) {
        if (this.selectedGroup && this.selectedGroup.id == event.group.id) {
            this.deselectPositionGroup();
        }
        if (
            this.selectedPosition &&
            this.selectedPosition.group!.id == event.group.id
        ) {
            this.deselectPosition();
        }
    }

    // #endregion

    private deselectAll() {
        this.deselectPosition();
        this.deselectPositionGroup();
    }

    private deselectPosition() {
        if (this.selectedPosition) {
            this.eventBus.publish(new PositionDeselectedEvent(this.selectedPosition));
            this.selectedPosition = null;
        }
    }

    private deselectPositionGroup() {
        if (this.selectedGroup) {
            this.eventBus.publish(new PositionGroupDeselectedEvent(this.selectedGroup));
            this.selectedGroup = null;
        }
    }
}
