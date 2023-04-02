import { AppConfig } from "../config";
import { PositionGroup } from "./position_group";
import * as ko from "knockout";

export class Model {
    positionGroups: ko.ObservableArray<PositionGroup>;

    constructor() {
        this.positionGroups = ko.observableArray();
    }

    public log() {
        this.positionGroups().forEach((group: PositionGroup) => {
            console.info(group.name());
            console.info(group.positions());
        });
    }

    /** Returns `PositionGroup` matching id, or null */
    public lookupGroupById(id: number) {
        for (let group of this.positionGroups()) {
            if (group.id == id) {
                return group;
            }
        }
        return null;
    }

    /** Returns `Position` matching id, or null */
    public lookupPositionById(positionId: number) {
        for (let group of this.positionGroups()) {
            for (let wpt of group.positions()) {
                if (wpt.id == positionId) {
                    return wpt;
                }
            }
        }
        return null;
    }

    /** Returns `PositionGroup` containing position with matching id, or null */
    public lookupGroupForPositionId(id: number) {
        for (let group of this.positionGroups()) {
            for (let wpt of group.positions()) {
                if (wpt.id == id) {
                    return group;
                }
            }
        }
        return null;
    }
}
