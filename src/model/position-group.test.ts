import { describe, test } from "@jest/globals";
import { addPositionToGroup, createPositionGroup } from "./position-group";
import { createPosition } from "./position";

describe("model/position-group", () => {
    test("create position group from position array", () => {
        const position = createPosition(123, -0.123);
        const group = createPositionGroup([position]);

        expect(group.positions.length).toBe(1);
        expect(group.positions[0].id).toStrictEqual(position.id);
        expect(group.positions[0].groupId).toStrictEqual(group.id);
    });
    test("create position group without positions", () => {
        const group = createPositionGroup();
        expect(group.positions.length).toBe(0);
    });
    test("created groups have unique IDs", () => {
        const group1 = createPositionGroup();
        const group2 = createPositionGroup();
        expect(group1.id).not.toStrictEqual(group2.id);
    });
    test("add position to group", () => {
        const group = createPositionGroup();
        const position = createPosition(123, 456);
        expect(position.groupId).not.toBeTruthy();

        addPositionToGroup(position, group);

        expect(position.groupId === group.id);
        expect(group.positions.find((pos) => pos.id === position.id)).toStrictEqual(
            position
        );
    });
});
