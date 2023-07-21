import { AppConfig } from "../config";

let idGenerator: number = 0;

export interface Position {
    id: string;
    groupId?: string;
    name: string;
    selected: boolean;
    latitude: number;
    longitude: number;
    showMapMarker: boolean;
    showMapMarkerLabel: boolean;
}

/** Creates unique Position objects */
export function createPosition(
    latitude: number,
    longitude: number,
    groupId?: string
): Position {
    const id = ++idGenerator;
    return {
        id: `pos-${id}`,
        groupId: groupId,
        name: AppConfig.DefaultPositionNamePrefix + String(id),
        latitude: latitude,
        longitude: longitude,
        selected: false,
        showMapMarker: true,
        showMapMarkerLabel: true,
    };
}
