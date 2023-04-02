import { AppConfig } from "./config";
import {
    EventBus,
    PositionSortedEvent,
    PositionGroupHtmlRenderedEvent,
    PositionGroupRemovedEvent,
} from "./events";
import { Model } from "./model/model";
import Sortable from "sortablejs";

/**
 * This class uses the `sortablejs` library to enable drag and drop of positions. It allows the user
 * to modify a position's position/index within a group, as well as to move a position between
 * groups, from and to any position/index.
 */
export class PositionSorter {
    eventBus: EventBus;
    model: Model;
    sortables: Map<number, Sortable>;

    constructor(eventBus: EventBus, model: Model) {
        this.eventBus = eventBus;
        this.model = model;
        this.sortables = new Map();

        eventBus.subscribeToPositionGroupRemovedEvent(
            this.handlePositionGroupRemoved.bind(this)
        );
        eventBus.subscribeToPositionGroupHtmlRenderedEvent(
            this.handlePositionGroupHtmlRendered.bind(this)
        );
    }

    private handlePositionGroupRemoved(event: PositionGroupRemovedEvent): void {
        this.sortables.delete(event.group.id);
    }

    private handlePositionGroupHtmlRendered(
        event: PositionGroupHtmlRenderedEvent
    ): void {
        if (this.sortables.has(event.groupId)) return;
        this.initDragAndDrop(event.groupId);
    }

    private initDragAndDrop(groupId: number) {
        const positionListId =
            AppConfig.DOMSymbols.PositionListPrefix + groupId.toString();
        const positionListElement = document.getElementById(positionListId)!;

        this.sortables.set(
            groupId,
            new Sortable(positionListElement, {
                animation: 150,
                ghostClass: "ghost",
                group: "shared",
                onSort: this.handleSortPosition.bind(this),
            })
        );
    }

    private handleSortPosition(event: Sortable.SortableEvent) {
        const srcGroupId = event.from.id.replace(
            AppConfig.DOMSymbols.PositionListPrefix,
            ""
        );
        const destGroupId = event.to.id.replace(
            AppConfig.DOMSymbols.PositionListPrefix,
            ""
        );
        const srcGroup = this.model.lookupGroupById(Number(srcGroupId));
        const destGroup = this.model.lookupGroupById(Number(destGroupId));

        if (!(srcGroup && destGroup)) return;

        // Moving positions across lists, generates 2 very
        // similar *sort* events. We only want to act upon
        // one of them. This is a guard to ignore the 2nd.
        // @ts-ignore: Deprecated property
        const srcId = event.srcElement.id.replace(
            AppConfig.DOMSymbols.PositionListPrefix,
            ""
        );
        if (srcId != srcGroupId) return;

        // Sortable modifies the DOM without modifying the KO viewmodel,
        // when we sync the viewmodel to match the DOM, KO will render
        // a duplicate list item. To counteract this, we'll just delete
        // the moved element.
        event.item.remove();

        // Move Position from source group to destination group
        const srcIndex = Number(event.oldIndex);
        const destIndex = Number(event.newIndex);
        const position = srcGroup.positions()[srcIndex];
        srcGroup.positions.splice(srcIndex, 1);
        destGroup.positions.splice(destIndex, 0, position);
        position.group = destGroup;

        // Publish sorted event
        this.eventBus.publish(
            new PositionSortedEvent(position, srcGroup, srcIndex, destGroup, destIndex)
        );
    }
}
