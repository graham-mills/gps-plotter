import { Model } from "../model/model";
import { Waypoint } from "../model/waypoint";
import { WaypointGroup } from "../model/waypoint_group";
import * as ko from "knockout";
import {
    EventBus,
    HideWaypointGroupEvent,
    RemoveWaypointEvent,
    RemoveWaypointGroupEvent,
    ShowWaypointGroupEvent,
    WaypointDeselectedEvent,
    WaypointGroupDeselectedEvent,
    WaypointGroupHtmlRenderedEvent,
    WaypointGroupRemovedEvent,
    WaypointGroupSelectedEvent,
    WaypointRemovedEvent,
    WaypointSelectedEvent,
} from "../events";
import { AppConfig } from "../config";

/** View Model for the HTML component `#group-list`  */
export class GroupList {
    eventBus: EventBus;
    model: Model;
    selectedGroup: Optional<WaypointGroup>;
    selectedWaypoint: Optional<Waypoint>;

    constructor(eventBus: EventBus, model: Model) {
        this.eventBus = eventBus;
        this.model = model;
        this.selectedGroup = null;
        this.selectedWaypoint = null;

        eventBus.subscribeToWaypointSelectedEvent(
            this.handleWaypointSelected.bind(this)
        );
        eventBus.subscribeToWaypointGroupSelectedEvent(
            this.handleWaypointGroupSelected.bind(this)
        );
        eventBus.subscribeToWaypointRemovedEvent(this.handleWaypointRemoved.bind(this));
        eventBus.subscribeToWaypointGroupRemovedEvent(
            this.handleWaypointGroupRemoved.bind(this)
        );

        ko.applyBindings(
            this,
            document.getElementById(AppConfig.DOMSymbols.WaypointGroupList)
        );
    }

    //#region Knockout Bound Methods

    private waypointGroupHtmlRendered(groupId: number) {
        this.eventBus.publish(new WaypointGroupHtmlRenderedEvent(groupId));
    }

    private hideWaypointGroup(groupId: number) {
        const group = this.model.lookupGroupById(groupId)!;
        this.eventBus.publish(new HideWaypointGroupEvent(group));
    }

    private showWaypointGroup(groupId: number) {
        const group = this.model.lookupGroupById(groupId)!;
        this.eventBus.publish(new ShowWaypointGroupEvent(group));
    }

    private deleteWaypoint(waypointId: number) {
        this.eventBus.publish(new RemoveWaypointEvent(waypointId));
    }

    private deleteWaypointGroup(groupId: number) {
        this.eventBus.publish(new RemoveWaypointGroupEvent(groupId));
    }

    private selectGroupById(groupId: number) {
        if (this.selectedGroup?.id == groupId) return;
        const waypointGroup = this.model.lookupGroupById(groupId)!;
        this.deselectAll();
        this.selectedGroup = waypointGroup;
        this.eventBus.publish(new WaypointGroupSelectedEvent(waypointGroup));
    }

    private selectWaypointById(waypointId: number) {
        if (this.selectedWaypoint?.id == waypointId) return;
        const waypoint = this.model.lookupWaypointById(waypointId)!;
        this.deselectAll();
        this.selectedWaypoint = waypoint;
        this.eventBus.publish(new WaypointSelectedEvent(waypoint));
    }

    // #endregion

    // #region Internal Event Handlers

    // Waypoints may be selected by other components in addition to
    // this one. For example, on clicking a map marker. We must check
    // if we have selected each item already to avoid generating
    // unncesssary deselect/select events.

    private handleWaypointSelected(event: WaypointSelectedEvent) {
        if (this.selectedWaypoint?.id == event.waypoint.id) return;
        this.deselectAll();
        this.selectedWaypoint = event.waypoint;
    }

    private handleWaypointGroupSelected(event: WaypointGroupSelectedEvent) {
        if (this.selectedGroup?.id == event.waypointGroup.id) return;
        this.deselectAll();
        this.selectedGroup = event.waypointGroup;
    }

    private handleWaypointRemoved(event: WaypointRemovedEvent) {
        if (this.selectedWaypoint && this.selectedWaypoint.id == event.waypoint.id) {
            this.deselectWaypoint();
        }
    }

    private handleWaypointGroupRemoved(event: WaypointGroupRemovedEvent) {
        if (this.selectedGroup && this.selectedGroup.id == event.group.id) {
            this.deselectWaypointGroup();
        }
    }

    // #endregion

    private deselectAll() {
        this.deselectWaypoint();
        this.deselectWaypointGroup();
    }

    private deselectWaypoint() {
        if (this.selectedWaypoint) {
            this.eventBus.publish(new WaypointDeselectedEvent(this.selectedWaypoint));
            this.selectedWaypoint = null;
        }
    }

    private deselectWaypointGroup() {
        if (this.selectedGroup) {
            this.eventBus.publish(new WaypointGroupDeselectedEvent(this.selectedGroup));
            this.selectedGroup = null;
        }
    }
    // selectGroup(groupId: number) {
    //     let group = this.model.lookupGroupById(groupId);
    //     if (!group) return;

    //     if (this.selectedGroup() && this.selectedGroup()!.id == groupId)
    //     {
    //         this.controller.map.focusOnWaypointGroup(group);
    //         return;
    //     }

    //     this.deselectAll();
    //     this.selectedGroup(group);
    //     group.selected(true);
    //     this.groupFormData().populate(group);
    // }
    // selectWaypoint(waypointId: number) {
    //     let waypoint = this.model.lookupWaypointById(waypointId);
    //     if (!waypoint) return;

    //     if (this.selectedWaypoint()?.id == waypoint.id)
    //     {
    //         this.controller.map.focusOnWaypoint(waypoint);
    //         return;
    //     }

    //     this.deselectAll();
    //     this.selectedWaypoint(waypoint);
    //     waypoint.selected(true);
    //     this.controller.selectWaypoint(waypoint);
    //     this.waypointFormData().populate(waypoint);
    // }
    // deselectAll() {
    //     this.deselectGroup();
    //     this.deselectWaypoint();
    // }
    // deselectGroup() {
    //     if (this.selectedGroup())
    //     {
    //         this.deselectGroupById(this.selectedGroup()!.id);
    //     }
    // }
    // deselectWaypoint() {
    //     if (this.selectedWaypoint())
    //     {
    //         this.deselectWaypointById(this.selectedWaypoint()!.id);
    //     }
    // }
    // deselectGroupById(groupId: number) {
    //     this.model.lookupGroupById(groupId)?.selected(false);
    //     this.selectedGroup(null);
    // }
    // deselectWaypointById(waypointId: number) {
    //     this.model.lookupWaypointById(waypointId)?.selected(false);
    //     this.selectedWaypoint(null);
    //     const waypoint = this.model.lookupWaypointById(waypointId);
    //     if (waypoint)
    //     {
    //         this.controller.deselectWaypoint(waypoint);
    //     }
    // }
    // handleSelectedGroupSaved() {
    //     if (!this.selectedGroup()) return;
    //     this.controller.updateWaypointGroup(
    //         this.selectedGroup()!.id,
    //         this.groupFormData().name(),
    //         this.groupFormData().drawPolyline(),
    //         this.groupFormData().showMarkers(),
    //         this.groupFormData().lineColor()
    //     );
    // }
    // handleSelectedWaypointSaved() {
    //     if (!this.selectedWaypoint() || !this.waypointFormData()) return;
    //     this.controller.updateWaypoint(
    //         this.selectedWaypoint()!.id,
    //         this.waypointFormData().name(),
    //         Number(this.waypointFormData().latitude()),
    //         Number(this.waypointFormData().longitude())
    //     );
    // }
    // handleAddEmptyGroup() {
    //     let group = this.controller.addEmptyGroup();
    //     this.selectGroup(group.id);
    // }
    // handleRemoveAllGroups() {
    //     this.controller.handleRemoveAllGroups();
    //     this.deselectAll();
    // }
    // handleRemoveWaypointGroup(groupId: number) {
    //     this.controller.handleRemoveWaypointGroup(groupId);
    //     if (this.selectedGroup() && this.selectedGroup()!.id == groupId)
    //     {
    //         this.deselectGroup();
    //     }
    //     if (this.selectedWaypoint() && !this.model.lookupWaypointById(this.selectedWaypoint()!.id))
    //     {
    //         this.deselectWaypoint();
    //     }
    // }
    // handleRemoveWaypoint(waypointId: number) {
    //     this.controller.handleRemoveWaypoint(waypointId);
    //     if (this.selectedWaypoint() && !this.model.lookupWaypointById(this.selectedWaypoint()!.id))
    //     {
    //         this.deselectWaypoint();
    //     }
    // }
}
