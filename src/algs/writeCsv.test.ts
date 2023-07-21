import { describe, test } from "@jest/globals";
import { ExportHeader, groupsToCsv } from "./writeCsv";
import { PositionGroup, createPositionGroup } from "../model/position-group";
import { createPosition } from "../model/position";

const generateMockData = (): Array<PositionGroup> => {
    const groups: Array<PositionGroup> = [];

    groups.push(
        createPositionGroup([
            createPosition(11.00001, -11.12345),
            createPosition(12.00005, -12.12345),
        ])
    );
    groups.push(createPositionGroup([createPosition(-12, 0.5)]));
    groups[0].name = "Group A";
    groups[0].positions[0].name = "Pos 1";
    groups[0].positions[1].name = "Pos 2";
    groups[1].name = "Group B";
    groups[1].positions[0].name = "Pos 3";
    return groups;
};

describe("algs/writeCsv", () => {
    test("when no headers are selected for export, then the generated csv is empty", () => {
        const groups: Array<PositionGroup> = generateMockData();
        const exportHeaders: Array<ExportHeader> = [];

        const csvText = groupsToCsv(groups, exportHeaders);

        expect(csvText).toBe("");
    });
    test("when the group name header is selected for export, then the generated csv contains the expected number of lines for the header row + all position rows", () => {
        const groups: Array<PositionGroup> = generateMockData();
        const exportHeaders: Array<ExportHeader> = [ExportHeader.GroupName];

        const csvText = groupsToCsv(groups, exportHeaders);

        expect(csvText.trim().split("\n").length).toBe(4); // 3 position rows + header row
    });
    test("when a subset of headers are given, then the generated header row contains these headers", () => {
        const groups: Array<PositionGroup> = generateMockData();
        const exportHeaders: Array<ExportHeader> = [
            ExportHeader.PositionName,
            ExportHeader.Latitude,
            ExportHeader.Longitude,
        ];

        const csvText = groupsToCsv(groups, exportHeaders);

        const outputHeaderNames = csvText.split("\n")[0].split(",");
        expect(outputHeaderNames.length).toBe(exportHeaders.length);
        exportHeaders.forEach((expectedHeader) => {
            expect(outputHeaderNames).toContain(expectedHeader);
        });
    });
    test("when csv data is generated for all exportable headers, then the generated csv contains position data for all positions for all exported headers", () => {
        const groups: Array<PositionGroup> = generateMockData();
        const exportHeaders: Array<ExportHeader> = [
            ExportHeader.GroupName,
            ExportHeader.PositionName,
            ExportHeader.Latitude,
            ExportHeader.Longitude,
        ];

        const csvText = groupsToCsv(groups, exportHeaders);

        expect(csvText).toStrictEqual(
            [
                "group,position,latitude,longitude",
                "Group A,Pos 1,11.00001,-11.12345",
                "Group A,Pos 2,12.00005,-12.12345",
                "Group B,Pos 3,-12,0.5\n",
            ].join("\n")
        );
    });
});
