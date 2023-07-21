import { describe, test } from "@jest/globals";
import { ParseError, positionsFromCsv } from "./parseCsv";
import { Position } from "../model/position";

describe("algs/parseCsv", () => {
    test("should throw error for empty csv", () => {
        expect(() => {
            positionsFromCsv("");
        }).toThrow(ParseError);
    });
    test("should throw error for no position rows", () => {
        expect(() => {
            positionsFromCsv("latitude,longitude");
        }).toThrow(ParseError);
    });
    test("should throw error for non-existing column headers", () => {
        expect(() => {
            positionsFromCsv("latitude,longitude", "_latitude", "_longitude");
        }).toThrow(ParseError);
    });
    test("should throw error if rows do not contain enough columns/fields", () => {
        expect(() => {
            positionsFromCsv(["123,-123.0", "123"].join("\n"));
        }).toThrow(ParseError);
    });
    test("should throw error for empty fields", () => {
        expect(() => {
            positionsFromCsv(["123,123", ",123"].join("\n"));
        }).toThrow(ParseError);
    });
    test("should throw error for non-parseable input", () => {
        expect(() => {
            positionsFromCsv(["123,notanum"].join("\n"));
        }).toThrow(ParseError);
    });
    test("should parse positions without header row", () => {
        const csvData = ["123,123,abc", "-0.0123,-0.0123,abc"].join("\n");

        const positions: Position[] = positionsFromCsv(csvData);

        expect(positions.length).toEqual(2);
    });
    test("should parse positions from columns named `latitude` and `longitude` by default", () => {
        const csvData = [
            "id,latitude,longitude",
            "p1,123,123",
            "p2,-0.0123,-0.0123",
        ].join("\n");

        const positions: Position[] = positionsFromCsv(csvData);

        expect(positions.length).toBe(2);
    });
    test("should parse positions from named columns when provided", () => {
        const csvData = [
            "id,_latitude,_longitude",
            "p1,123,123",
            "p2,-0.0123,-0.0123",
        ].join("\n");

        const positions: Position[] = positionsFromCsv(
            csvData,
            "_latitude",
            "_longitude"
        );

        expect(positions.length).toBe(2);
    });
    test("should parse position latitude and longitude values correctly", () => {
        const csvData = ["25,50", "-0.0123,-0.0123"].join("\n");

        const positions: Position[] = positionsFromCsv(csvData);

        expect(positions[0].latitude).toStrictEqual(25);
        expect(positions[0].longitude).toStrictEqual(50);
        expect(positions[1].latitude).toStrictEqual(-0.0123);
        expect(positions[1].longitude).toStrictEqual(-0.0123);
    });
    test("should filter out positions by downsampling amount", () => {
        const csvData = [
            "latitude,longitude",
            "1,1",
            "2,2",
            "3,3",
            "4,4",
            "5,5",
            "6,6",
        ].join("\n");

        const positions: Position[] = positionsFromCsv(
            csvData,
            undefined,
            undefined,
            3
        );

        expect(positions.length).toBe(3);
        expect(positions[0].latitude).toStrictEqual(1);
        expect(positions[1].latitude).toStrictEqual(3);
        expect(positions[2].latitude).toStrictEqual(6);
    });
});
