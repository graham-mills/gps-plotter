import { AppConfig } from "./config";
import {
    EventBus,
    WaypointSortedEvent,
    WaypointGroupHtmlRenderedEvent,
    WaypointGroupRemovedEvent,
} from "./events";
import { Model } from "./model/model";
import Sortable from "sortablejs";

/**
 * This class uses the `sortablejs` library to enable drag and drop of waypoints. It allows the user
 * to modify a waypoint's position/index within a group, as well as to move a waypoint between
 * groups, from and to any position/index.
 */
export class WaypointSorter {
    eventBus: EventBus;
    model: Model;
    sortables: Map<number, Sortable>;

    constructor(eventBus: EventBus, model: Model) {
        this.eventBus = eventBus;
        this.model = model;
        this.sortables = new Map();

        eventBus.subscribeToWaypointGroupRemovedEvent(
            this.handleWaypointGroupRemoved.bind(this)
        );
        eventBus.subscribeToWaypointGroupHtmlRenderedEvent(
            this.handleWaypointGroupHtmlRendered.bind(this)
        );
    }

    private handleWaypointGroupRemoved(event: WaypointGroupRemovedEvent): void {
        this.sortables.delete(event.group.id);
    }

    private handleWaypointGroupHtmlRendered(
        event: WaypointGroupHtmlRenderedEvent
    ): void {
        if (this.sortables.has(event.groupId)) return;
        this.initDragAndDrop(event.groupId);
    }

    private initDragAndDrop(groupId: number) {
        const waypointListId =
            AppConfig.DOMSymbols.WaypointListPrefix + groupId.toString();
        const waypointListElement = document.getElementById(waypointListId)!;

        this.sortables.set(
            groupId,
            new Sortable(waypointListElement, {
                animation: 150,
                ghostClass: "ghost",
                group: "shared",
                onSort: this.handleSortWaypoint.bind(this),
            })
        );
    }

    private handleSortWaypoint(event: Sortable.SortableEvent) {
        const srcGroupId = event.from.id.replace(
            AppConfig.DOMSymbols.WaypointListPrefix,
            ""
        );
        const destGroupId = event.to.id.replace(
            AppConfig.DOMSymbols.WaypointListPrefix,
            ""
        );
        const srcGroup = this.model.lookupGroupById(Number(srcGroupId));
        const destGroup = this.model.lookupGroupById(Number(destGroupId));

        if (!(srcGroup && destGroup)) return;

        // Moving waypoints across lists, generates 2 very
        // similar *sort* events. We only want to act upon
        // one of them. This is a guard to ignore the 2nd.
        // @ts-ignore: Deprecated property
        const srcId = event.srcElement.id.replace(
            AppConfig.DOMSymbols.WaypointListPrefix,
            ""
        );
        if (srcId != srcGroupId) return;

        // Sortable modifies the DOM without modifying the KO viewmodel,
        // when we sync the viewmodel to match the DOM, KO will render
        // a duplicate list item. To counteract this, we'll just delete
        // the moved element.
        event.item.remove();

        // Move Waypoint from source group to destination group
        const srcIndex = Number(event.oldIndex);
        const destIndex = Number(event.newIndex);
        const waypoint = srcGroup.waypoints()[srcIndex];
        srcGroup.waypoints.splice(srcIndex, 1);
        destGroup.waypoints.splice(destIndex, 0, waypoint);
        waypoint.group = destGroup;

        // Publish sorted event
        this.eventBus.publish(
            new WaypointSortedEvent(waypoint, srcGroup, srcIndex, destGroup, destIndex)
        );
    }
}
