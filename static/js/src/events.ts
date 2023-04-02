import { Position } from "./model/position";
import { PositionGroup } from "./model/position_group";

// #region events

/** App initialised; model seeded */
export class AppInitialisedEvent {
    constructor() {}
}

/** Add new position to model */
export class AddPositionEvent {
    constructor(
        public position: Position,
        public groupId: number,
        public atIndex: Optional<number> = null
    ) {}
}

/** Remove position from model */
export class RemovePositionEvent {
    constructor(public positionId: number) {}
}

/** Add position group to model */
export class AddPositionGroupEvent {
    constructor(public positionGroup: PositionGroup) {}
}

/** Remove position group from model */
export class RemovePositionGroupEvent {
    constructor(public positionGroupId: number) {}
}

/** Make position group visible on map */
export class ShowPositionGroupEvent {
    constructor(public positionGroup: PositionGroup) {}
}

/** Hide position group from map */
export class HidePositionGroupEvent {
    constructor(public positionGroup: PositionGroup) {}
}

/** Updates position */
export class UpdatePositionEvent {
    constructor(public updatedPosition: Position) {}
}

/** Updates position group */
export class UpdatePositionGroupEvent {
    constructor(public updatedGroup: PositionGroup) {}
}

/** Position updated in model */
export class PositionUpdatedEvent {
    constructor(public position: Position) {}
}

/** Position group updated in model */
export class PositionGroupUpdatedEvent {
    constructor(public positionGroup: PositionGroup) {}
}

/** Position sorted (moved group and/or changed index) */
export class PositionSortedEvent {
    positionMovedGroups: boolean = false;

    constructor(
        public position: Position,
        public previousGroup: PositionGroup,
        public previousIndex: number,
        public currentGroup: PositionGroup,
        public currentIndex: number
    ) {
        this.positionMovedGroups = previousGroup.id != currentGroup.id;
    }
}

/** Position has been added to the model */
export class PositionAddedEvent {
    constructor(public position: Position) {}
}

/** Position has been removed from the model */
export class PositionRemovedEvent {
    constructor(public position: Position) {}
}

/** Position group has been added to the model */
export class PositionGroupAddedEvent {
    constructor(public group: PositionGroup) {}
}

/** Position group has been removed from the model */
export class PositionGroupRemovedEvent {
    constructor(public group: PositionGroup) {}
}

/** HTML for position group has been rendered */
export class PositionGroupHtmlRenderedEvent {
    constructor(public groupId: number) {}
}

/** Position selected by user */
export class PositionSelectedEvent {
    constructor(public position: Position) {}
}

/** Position group selected by user */
export class PositionGroupSelectedEvent {
    constructor(public positionGroup: PositionGroup) {}
}

/** Position de-selected by user */
export class PositionDeselectedEvent {
    constructor(public position: Position) {}
}

/** Position group de-selected by user */
export class PositionGroupDeselectedEvent {
    constructor(public positionGroup: PositionGroup) {}
}

// #endregion events

export type EventType =
    | AddPositionEvent
    | RemovePositionEvent
    | AddPositionGroupEvent
    | RemovePositionGroupEvent
    | ShowPositionGroupEvent
    | HidePositionGroupEvent
    | UpdatePositionEvent
    | UpdatePositionGroupEvent
    | PositionUpdatedEvent
    | PositionGroupUpdatedEvent
    | PositionSortedEvent
    | PositionAddedEvent
    | PositionRemovedEvent
    | PositionGroupAddedEvent
    | PositionGroupRemovedEvent
    | PositionGroupHtmlRenderedEvent
    | PositionSelectedEvent
    | PositionGroupSelectedEvent
    | PositionDeselectedEvent
    | PositionGroupDeselectedEvent
    | AppInitialisedEvent;

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
    public subscribeToAppInitialisedEvent(callback: Callback<AppInitialisedEvent>) {
        let pub = this.getPublisher<AppInitialisedEvent>("AppInitialisedEvent");
        pub.subscribe(callback);
    }
    public subscribeToAddPositionEvent(callback: Callback<AddPositionEvent>) {
        let pub = this.getPublisher<AddPositionEvent>("AddPositionEvent");
        pub.subscribe(callback);
    }
    public subscribeToRemovePositionEvent(callback: Callback<RemovePositionEvent>) {
        let pub = this.getPublisher<RemovePositionEvent>("RemovePositionEvent");
        pub.subscribe(callback);
    }
    public subscribeToAddPositionGroupEvent(callback: Callback<AddPositionGroupEvent>) {
        let pub = this.getPublisher<AddPositionGroupEvent>("AddPositionGroupEvent");
        pub.subscribe(callback);
    }
    public subscribeToRemovePositionGroupEvent(
        callback: Callback<RemovePositionGroupEvent>
    ) {
        let pub = this.getPublisher<RemovePositionGroupEvent>(
            "RemovePositionGroupEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToHidePositionGroupEvent(
        callback: Callback<HidePositionGroupEvent>
    ) {
        let pub = this.getPublisher<HidePositionGroupEvent>("HidePositionGroupEvent");
        pub.subscribe(callback);
    }
    public subscribeToShowPositionGroupEvent(
        callback: Callback<ShowPositionGroupEvent>
    ) {
        let pub = this.getPublisher<ShowPositionGroupEvent>("ShowPositionGroupEvent");
        pub.subscribe(callback);
    }
    public subscribeToUpdatePositionEvent(callback: Callback<UpdatePositionEvent>) {
        let pub = this.getPublisher<UpdatePositionEvent>("UpdatePositionEvent");
        pub.subscribe(callback);
    }
    public subscribeToUpdatePositionGroupEvent(
        callback: Callback<UpdatePositionGroupEvent>
    ) {
        let pub = this.getPublisher<UpdatePositionGroupEvent>(
            "UpdatePositionGroupEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToPositionUpdatedEvent(callback: Callback<PositionUpdatedEvent>) {
        let pub = this.getPublisher<PositionUpdatedEvent>("PositionUpdatedEvent");
        pub.subscribe(callback);
    }
    public subscribeToPositionGroupUpdatedEvent(
        callback: Callback<PositionGroupUpdatedEvent>
    ) {
        let pub = this.getPublisher<PositionGroupUpdatedEvent>(
            "PositionGroupUpdatedEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToPositionSortedEvent(callback: Callback<PositionSortedEvent>) {
        let pub = this.getPublisher<PositionSortedEvent>("PositionSortedEvent");
        pub.subscribe(callback);
    }
    public subscribeToPositionAddedEvent(callback: Callback<PositionAddedEvent>) {
        let pub = this.getPublisher<PositionAddedEvent>("PositionAddedEvent");
        pub.subscribe(callback);
    }
    public subscribeToPositionRemovedEvent(callback: Callback<PositionRemovedEvent>) {
        let pub = this.getPublisher<PositionRemovedEvent>("PositionRemovedEvent");
        pub.subscribe(callback);
    }
    public subscribeToPositionGroupAddedEvent(
        callback: Callback<PositionGroupAddedEvent>
    ) {
        let pub = this.getPublisher<PositionGroupAddedEvent>("PositionGroupAddedEvent");
        pub.subscribe(callback);
    }
    public subscribeToPositionGroupRemovedEvent(
        callback: Callback<PositionGroupRemovedEvent>
    ) {
        let pub = this.getPublisher<PositionGroupRemovedEvent>(
            "PositionGroupRemovedEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToPositionGroupHtmlRenderedEvent(
        callback: Callback<PositionGroupHtmlRenderedEvent>
    ) {
        let pub = this.getPublisher<PositionGroupHtmlRenderedEvent>(
            "PositionGroupHtmlRenderedEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToPositionSelectedEvent(callback: Callback<PositionSelectedEvent>) {
        let pub = this.getPublisher<PositionSelectedEvent>("PositionSelectedEvent");
        pub.subscribe(callback);
    }
    public subscribeToPositionGroupSelectedEvent(
        callback: Callback<PositionGroupSelectedEvent>
    ) {
        let pub = this.getPublisher<PositionGroupSelectedEvent>(
            "PositionGroupSelectedEvent"
        );
        pub.subscribe(callback);
    }
    public subscribeToPositionDeselectedEvent(
        callback: Callback<PositionDeselectedEvent>
    ) {
        let pub = this.getPublisher<PositionDeselectedEvent>("PositionDeselectedEvent");
        pub.subscribe(callback);
    }
    public subscribeToPositionGroupDeselectedEvent(
        callback: Callback<PositionGroupDeselectedEvent>
    ) {
        let pub = this.getPublisher<PositionGroupDeselectedEvent>(
            "PositionGroupDeselectedEvent"
        );
        pub.subscribe(callback);
    }
}
