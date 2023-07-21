import { PositionGroup } from "../model/position-group";

export enum ExportHeader {
    GroupName = "group",
    PositionName = "position",
    Latitude = "latitude",
    Longitude = "longitude",
}

/** Converts position groups to a CSV file, outputting only data for the specified headers */
export const groupsToCsv = (
    groups: Array<PositionGroup>,
    headers: Array<ExportHeader>
): string => {
    if (headers.length === 0) {
        return "";
    }

    let csvText = "";

    const includeGroupName: boolean =
        headers.find((header) => header === ExportHeader.GroupName) !== undefined;
    const includePositionName: boolean =
        headers.find((header) => header === ExportHeader.PositionName) !== undefined;
    const includeLatitude: boolean =
        headers.find((header) => header === ExportHeader.Latitude) !== undefined;
    const includeLongitude: boolean =
        headers.find((header) => header === ExportHeader.Longitude) !== undefined;

    // Append header row
    let row = "";
    if (includeGroupName) {
        row += "group,";
    }
    if (includePositionName) {
        row += "position,";
    }
    if (includeLatitude) {
        row += "latitude,";
    }
    if (includeLongitude) {
        row += "longitude,";
    }
    row = row.slice(0, -1); // Remove trailing comma
    row += "\n";
    csvText += row;

    // Append data rows
    groups.forEach((group) => {
        group.positions.forEach((pos) => {
            row = "";
            if (includeGroupName) {
                row += `${group.name},`;
            }
            if (includePositionName) {
                row += `${pos.name},`;
            }
            if (includeLatitude) {
                row += `${pos.latitude},`;
            }
            if (includeLongitude) {
                row += `${pos.longitude},`;
            }
            row = row.slice(0, -1); // Remove trailing comma
            row += "\n";
            csvText += row;
        });
    });

    return csvText;
};
