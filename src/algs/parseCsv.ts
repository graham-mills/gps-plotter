import { Position, createPosition } from "../model/position";

export class ParseError {
    constructor(public message: string) {}
}

export const positionsFromCsv = (
    text: string,
    userSpecifiedLatitudeColName: Optional<string> = null,
    userSpecifiedLongitudeColName: Optional<string> = null,
    filterSampleSize: Optional<number> = null
): Array<Position> => {
    const lines = text.split("\n").filter((line) => line.length > 0);

    if (lines.length === 0) {
        throw new ParseError("Text area is empty");
    }

    const headerRow = lines[0];
    let latIndex = userSpecifiedLatitudeColName
        ? findHeaderIndexMandatory(userSpecifiedLatitudeColName, headerRow)
        : findHeaderIndex("latitude", headerRow);

    let lonIndex = userSpecifiedLongitudeColName
        ? findHeaderIndexMandatory(userSpecifiedLongitudeColName, headerRow)
        : findHeaderIndex("longitude", headerRow);

    let dataRowStart = 1;
    let dataRowCount = lines.length - dataRowStart;
    if (latIndex == null || lonIndex == null) {
        dataRowStart = 0;
        dataRowCount = lines.length;
        latIndex = 0;
        lonIndex = 1;
    }

    const positions: Array<Position> = [];
    let lineIndex = 0;
    for (let i = 1; i <= dataRowCount; ++i) {
        lineIndex = i - 1 + dataRowStart;

        if (i !== 1 && i !== dataRowCount) {
            if (filterSampleSize && i % filterSampleSize !== 0) {
                continue;
            }
        }

        const position = parseLine(lines[lineIndex], i, latIndex, lonIndex);
        positions.push(position);
    }

    if (positions.length === 0) {
        throw new ParseError("Failed to import positions");
    }

    return positions;
};

const findHeaderIndexMandatory = (columnName: string, headerLine: string): number => {
    const index = findHeaderIndex(columnName, headerLine);
    if (index === null) {
        throw new ParseError(
            `Line 1 does not contain the specified column name "${columnName!}" - "${headerLine})"`
        );
    }
    return index;
};

const findHeaderIndex = (headerName: string, headerLine: string): Optional<number> => {
    const headerNames = headerLine.split(",");

    if (headerNames.length < 2) {
        throw new ParseError(
            `Line 1 does not contain at least 2 columns\n - "${headerLine}"`
        );
    }

    for (let i = 0; i < headerNames.length; ++i) {
        if (headerNames[i].trim().toLowerCase() === headerName.trim().toLowerCase()) {
            return i;
        }
    }
    return null;
};

const parseLine = (
    line: string,
    lineNo: number,
    latitudeColIndex: number,
    longitudeColIndex: number
): Position => {
    const cells = line.split(",");

    if (cells.length < 2) {
        throw new ParseError(
            `Line ${lineNo.toString()} does not contain at least 2 columns\n - "${line}"`
        );
    }

    if (latitudeColIndex >= cells.length) {
        throw new ParseError(
            `Line ${lineNo.toString()} does not contain a latitude column (${(
                latitudeColIndex + 1
            ).toString()})\n - "${line}"`
        );
    }

    if (longitudeColIndex >= cells.length) {
        throw new ParseError(
            `Line ${lineNo.toString()} does not contain a longitude column (${(
                longitudeColIndex + 1
            ).toString()})\n - "${line}"`
        );
    }

    const latitude_str = cells[latitudeColIndex].trim();
    const longitude_str = cells[longitudeColIndex].trim();

    const latitude = parseFloat(latitude_str);
    const longitude = parseFloat(longitude_str);

    if (isNaN(latitude))
        throw new ParseError(
            `Failed to parse latitude value (Line ${lineNo.toString()}, Column ${(
                latitudeColIndex + 1
            ).toString()})\n - "${latitude_str}"`
        );

    if (isNaN(longitude))
        throw new ParseError(
            `Failed to parse longitude value (Line ${lineNo.toString()}, Column ${(
                longitudeColIndex + 1
            ).toString()})\n - "${longitude_str}"`
        );

    return createPosition(latitude, longitude);
};
