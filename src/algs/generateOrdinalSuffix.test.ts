import { describe, test } from "@jest/globals";
import { generateOrdinalSuffix } from "./generateOrdinalSuffix";

describe("algs/generateOrdinalSuffix", () => {
    test("1st ordinal", () => {
        expect(generateOrdinalSuffix(1)).toStrictEqual("st");
    });
    test("2nd ordinal", () => {
        expect(generateOrdinalSuffix(2)).toStrictEqual("nd");
    });
    test("3rd ordinal", () => {
        expect(generateOrdinalSuffix(3)).toStrictEqual("rd");
    });
    test("4th ordinal", () => {
        expect(generateOrdinalSuffix(4)).toStrictEqual("th");
    });
    test("11th ordinal", () => {
        expect(generateOrdinalSuffix(11)).toStrictEqual("th");
    });
    test("12th ordinal", () => {
        expect(generateOrdinalSuffix(12)).toStrictEqual("th");
    });
    test("13th ordinal", () => {
        expect(generateOrdinalSuffix(13)).toStrictEqual("th");
    });
    test("31st ordinal", () => {
        expect(generateOrdinalSuffix(31)).toStrictEqual("st");
    });
    test("32nd ordinal", () => {
        expect(generateOrdinalSuffix(32)).toStrictEqual("nd");
    });
    test("33rd ordinal", () => {
        expect(generateOrdinalSuffix(33)).toStrictEqual("rd");
    });
    test("34th ordinal", () => {
        expect(generateOrdinalSuffix(34)).toStrictEqual("th");
    });
    test("101st ordinal", () => {
        expect(generateOrdinalSuffix(101)).toStrictEqual("st");
    });
    test("102nd ordinal", () => {
        expect(generateOrdinalSuffix(102)).toStrictEqual("nd");
    });
    test("103rd ordinal", () => {
        expect(generateOrdinalSuffix(103)).toStrictEqual("rd");
    });
    test("104th ordinal", () => {
        expect(generateOrdinalSuffix(104)).toStrictEqual("th");
    });
});
