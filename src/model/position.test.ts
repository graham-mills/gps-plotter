import { describe, test } from "@jest/globals";
import { createPosition } from "./position";

describe("model/position", () => {
    test("create position with latitude and longitude", () => {
        const position = createPosition(123, -0.123);

        expect(position.latitude).toStrictEqual(123);
        expect(position.longitude).toStrictEqual(-0.123);
    });
    test("create position with group id", () => {
        const position = createPosition(123, -0.123, "group-2");
        expect(position.groupId).toStrictEqual("group-2");
    });
    test("created positions have unique IDs", () => {
        const pos1 = createPosition(1, 1);
        const pos2 = createPosition(1, 1);
        expect(pos1.id).not.toStrictEqual(pos2.id);
    });
});
