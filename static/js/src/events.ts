import { Waypoint } from "./model/waypoint";
import { WaypointGroup } from "./model/waypoint_group";

// #region events

/** Add new waypoint to model */
export class AddWaypointEvent {
    constructor(
        public waypoint: Waypoint,
        public groupId: number,
        public atIndex: Optional<number> = null
    ) {}
}

/** Remove waypoint from model */
export class RemoveWaypointEvent {
    constructor(public waypointId: number) {}
}

/** Add waypoint group to model */
export class AddWaypointGroupEvent {
    constructor(public waypointGroup: WaypointGroup) {}
}

/** Remove waypoint group from model */
export class RemoveWaypointGroupEvent {
    constructor(public waypointGroupId: number) {}
}

/** Make waypoint group visible on map */
export class ShowWaypointGroupEvent {
    constructor(public waypointGroup: WaypointGroup) {}
}

/** Hide waypoint group from map */
export class HideWaypointGroupEvent {
    constructor(public waypointGroup: WaypointGroup) {}
}

/** Updates waypoint */
export class UpdateWaypointEvent {
    constructor(public updatedWaypoint: Waypoint) {}
}

/** Updates waypoint group */
export class UpdateWaypointGroupEvent {
    constructor(public updatedGroup: WaypointGroup) {}
}

/** Waypoint updated in model */
export class WaypointUpdatedEvent {
    constructor(public waypoint: Waypoint) {}
}

/** Waypoint group updated in model */
export class WaypointGroupUpdatedEvent {
    constructor(public waypointGroup: WaypointGroup) {}
}

/** Waypoint sorted (moved group and/or changed index) */
export class WaypointSortedEvent {
    waypointMovedGroups: boolean = false;

    constructor(
        public waypoint: Waypoint,
        public previousGroup: WaypointGroup,
        public previousIndex: number,
        public currentGroup: WaypointGroup,
        public currentIndex: number
    ) {
        this.waypointMovedGroups = previousGroup.id != currentGroup.id;
    }
}

/** Waypoint has been added to the model */
export class WaypointAddedEvent {
    constructor(public waypoint: Waypoint) {}
}

/** Waypoint has been removed from the model */
export class WaypointRemovedEvent {
    constructor(public waypoint: Waypoint) {}
}

/** Waypoint group has been added to the model */
export class WaypointGroupAddedEvent {
    constructor(public group: WaypointGroup) {}
}

/** Waypoint group has been removed from the model */
export class WaypointGroupRemovedEvent {
    constructor(public group: WaypointGroup) {}
}

/** HTML for waypoint group has been rendered */
export class WaypointGroupHtmlRenderedEvent {
    constructor(public groupId: number) {}
}

/** Waypoint selected by user */
export class WaypointSelectedEvent {
    constructor(public waypoint: Waypoint) {}
}

/** Waypoint group selected by user */
export class WaypointGroupSelectedEvent {
    constructor(public waypointGroup: WaypointGroup) {}
}

/** Waypoint de-selected by user */
export class WaypointDeselectedEvent {
    constructor(public waypoint: Waypoint) {}
}

/** Waypoint group de-selected by user */
export class WaypointGroupDeselectedEvent {
    constructor(public waypointGroup: WaypointGroup) {}
}

// #endregion events

export type EventType =
    | AddWaypointEvent
    | RemoveWaypointEvent
    | AddWaypointGroupEvent
    | RemoveWaypointGroupEvent
    | ShowWaypointGroupEvent
    | HideWaypointGroupEvent
    | UpdateWaypointEvent
    | UpdateWaypointGroupEvent
    | WaypointUpdatedEvent
    | WaypointGroupUpdatedEvent
    | WaypointSortedEvent
    | WaypointAddedEvent
    | WaypointRemovedEvent
    | WaypointGroupAddedEvent
    | WaypointGroupRemovedEvent
    | WaypointGroupHtmlRenderedEvent
    | WaypointSelectedEvent
    | WaypointGroupSelectedEvent
    | WaypointDeselectedEvent
    | WaypointGroupDeselectedEvent;

type Callback<T> = (event: T) => void;

class EventPublisher<T extends EventType> {
    subscribers: Array<Callback<T>>;

    constructor() {
        this.subscribers = new Array<Callback<T>>();
    }
    subscribe(callback: Callback<T>) {
        this.subscribers.push(callback);
    }
    publish(event: T) {
        console.debug("[PUB][" + event.constructor.name + "] " + JSON.stringify(event));
        this.subscribers.forEach((cb) => cb(event));
    }
}

export class EventBus {
    publishers: Map<string, EventPublisher<EventType>>;

    constructor() {
        this.publishers = new Map<string, EventPublisher<EventType>>();
    }

    private getPublisher<T extends EventType>(eventName: string): EventPublisher<T> {
        if (!this.publishers.has(eventName)) {
            this.publishers.set(eventName, new EventPublisher());
        }
        return this.publishers.get(eventName)! as any as EventPublisher<T>;
    }

    public publish(event: EventType) {
        const eventName = event.constructor.name;
        this.getPublisher(eventName)!.publish(event);
    }
    public subscribeToAddWaypointEvent(callback: Callback<AddWaypointEvent>) {
        let pub = this.getPublisher<AddWaypointEvent>("AddWaypointEvent");
        pub.subscribe(callback);
    }
    public subscribeToRemoveWaypointEvent(callback: Callback<RemoveWaypointEvent>) {
        let pub = this.getPublisher<RemoveWaypointEvent>("RemoveWaypointEvent");
        pub.subscribe(callback);
    }
    public subscribeToAddWaypointGroupEvent(callback: Callback<AddWaypointGroupEvent>) {
        let pub = this.getPublisher<AddWaypointGroupEvent>("AddWaypointGroupEvent");
        pub.subscribe(callback);
    }
    public subscribeToRemoveWaypointGroupEvent(
        callback: Callback<RemoveWaypointGroupEvent>
    ) {
        let pub = this.getPublisher<RemoveWaypointGroupEvent>(
            "RemoveWaypointGroupEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToHideWaypointGroupEvent(
        callback: Callback<HideWaypointGroupEvent>
    ) {
        let pub = this.getPublisher<HideWaypointGroupEvent>("HideWaypointGroupEvent");
        pub.subscribe(callback);
    }
    public subscribeToShowWaypointGroupEvent(
        callback: Callback<ShowWaypointGroupEvent>
    ) {
        let pub = this.getPublisher<ShowWaypointGroupEvent>("ShowWaypointGroupEvent");
        pub.subscribe(callback);
    }
    public subscribeToUpdateWaypointEvent(callback: Callback<UpdateWaypointEvent>) {
        let pub = this.getPublisher<UpdateWaypointEvent>("UpdateWaypointEvent");
        pub.subscribe(callback);
    }
    public subscribeToUpdateWaypointGroupEvent(
        callback: Callback<UpdateWaypointGroupEvent>
    ) {
        let pub = this.getPublisher<UpdateWaypointGroupEvent>(
            "UpdateWaypointGroupEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToWaypointUpdatedEvent(callback: Callback<WaypointUpdatedEvent>) {
        let pub = this.getPublisher<WaypointUpdatedEvent>("WaypointUpdatedEvent");
        pub.subscribe(callback);
    }
    public subscribeToWaypointGroupUpdatedEvent(
        callback: Callback<WaypointGroupUpdatedEvent>
    ) {
        let pub = this.getPublisher<WaypointGroupUpdatedEvent>(
            "WaypointGroupUpdatedEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToWaypointSortedEvent(callback: Callback<WaypointSortedEvent>) {
        let pub = this.getPublisher<WaypointSortedEvent>("WaypointSortedEvent");
        pub.subscribe(callback);
    }
    public subscribeToWaypointAddedEvent(callback: Callback<WaypointAddedEvent>) {
        let pub = this.getPublisher<WaypointAddedEvent>("WaypointAddedEvent");
        pub.subscribe(callback);
    }
    public subscribeToWaypointRemovedEvent(callback: Callback<WaypointRemovedEvent>) {
        let pub = this.getPublisher<WaypointRemovedEvent>("WaypointRemovedEvent");
        pub.subscribe(callback);
    }
    public subscribeToWaypointGroupAddedEvent(
        callback: Callback<WaypointGroupAddedEvent>
    ) {
        let pub = this.getPublisher<WaypointGroupAddedEvent>("WaypointGroupAddedEvent");
        pub.subscribe(callback);
    }
    public subscribeToWaypointGroupRemovedEvent(
        callback: Callback<WaypointGroupRemovedEvent>
    ) {
        let pub = this.getPublisher<WaypointGroupRemovedEvent>(
            "WaypointGroupRemovedEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToWaypointGroupHtmlRenderedEvent(
        callback: Callback<WaypointGroupHtmlRenderedEvent>
    ) {
        let pub = this.getPublisher<WaypointGroupHtmlRenderedEvent>(
            "WaypointGroupHtmlRenderedEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToWaypointSelectedEvent(callback: Callback<WaypointSelectedEvent>) {
        let pub = this.getPublisher<WaypointSelectedEvent>("WaypointSelectedEvent");
        pub.subscribe(callback);
    }
    public subscribeToWaypointGroupSelectedEvent(
        callback: Callback<WaypointGroupSelectedEvent>
    ) {
        let pub = this.getPublisher<WaypointGroupSelectedEvent>(
            "WaypointGroupSelectedEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToWaypointDeselectedEvent(
        callback: Callback<WaypointDeselectedEvent>
    ) {
        let pub = this.getPublisher<WaypointDeselectedEvent>("WaypointDeselectedEvent");
        pub.subscribe(callback);
    }
    public subscribeToWaypointGroupDeselectedEvent(
        callback: Callback<WaypointGroupDeselectedEvent>
    ) {
        let pub = this.getPublisher<WaypointGroupDeselectedEvent>(
            "WaypointGroupDeselectedEvent"
        );
        pub.subscribe(callback);
    }
}
