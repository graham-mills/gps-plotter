import { Position } from "./model/position";

export class ParseError {
    constructor(public message: string) {}
}

export function positionsFromCsv(
    text: string,
    userSpecifiedLatitudeColName: Optional<string> = null,
    userSpecifiedLongitudeColName: Optional<string> = null,
    filterSampleSize: Optional<number> = null
): Array<Position> {
    const lines = text.split("\n");
    const headerRow = lines[0];
    let latIndex = userSpecifiedLatitudeColName
        ? findHeaderIndexMandatory(userSpecifiedLatitudeColName, headerRow)
        : findHeaderIndex("latitude", headerRow);

    let lonIndex = userSpecifiedLongitudeColName
        ? findHeaderIndexMandatory(userSpecifiedLongitudeColName, headerRow)
        : findHeaderIndex("longitude", headerRow);

    let dataRowStart = 1;
    if (latIndex == null || lonIndex == null) {
        dataRowStart = 0;
        latIndex = 0;
        lonIndex = 1;
    }

    let positions: Array<Position> = [];
    for (let i = dataRowStart; i < lines.length; ++i) {
        if (skipRow(i, dataRowStart, lines.length - 1, filterSampleSize)) {
            continue;
        }

        if (lines[i].length == 0) {
            continue;
        }

        const position = parseLine(lines[i], i + 1, latIndex, lonIndex);
        positions.push(position);
    }

    if (positions.length == 0) {
        throw new ParseError("Failed to import positions");
    }

    return positions;
}

function findHeaderIndexMandatory(columnName: string, headerLine: string): number {
    const index = findHeaderIndex(columnName, headerLine);
    if (index == null) {
        throw new ParseError(
            `Line 1 does not contain the column "${columnName!}"\n\n - "${headerLine}"`
        );
    }
    return index;
}

function findHeaderIndex(headerName: string, headerLine: string): Optional<number> {
    const headerNames = headerLine.split(",");

    if (headerNames.length < 2) {
        throw new ParseError(
            `Line 1 does not contain at least 2 columns\n - "${headerLine}"`
        );
    }

    for (let i = 0; i < headerNames.length; ++i) {
        if (headerNames[i].trim().toLowerCase() == headerName.trim().toLowerCase()) {
            return i;
        }
    }
    return null;
}

function parseLine(
    line: string,
    lineNo: number,
    latitudeColIndex: number,
    longitudeColIndex: number
): Position {
    const cells = line.split(",");

    if (cells.length < 2) {
        throw new ParseError(
            `Line ${lineNo.toString()} does not contain at least 2 columns\n - "${line}"`
        );
    }

    if (latitudeColIndex >= cells.length) {
        throw new ParseError(
            `Line ${lineNo.toString()} does not contain a latitude column (${latitudeColIndex.toString()})\n - "${line}"`
        );
    }

    if (longitudeColIndex >= cells.length) {
        throw new ParseError(
            `Line ${lineNo.toString()} does not contain a longitude column (${longitudeColIndex.toString()})\n - "${line}"`
        );
    }

    const latitude_str = cells[latitudeColIndex].trim();
    const longitude_str = cells[longitudeColIndex].trim();

    const latitude = parseFloat(latitude_str);
    const longitude = parseFloat(longitude_str);

    if (isNaN(latitude))
        throw new ParseError(
            `Failed to parse latitude value (Line ${lineNo.toString()}, Column ${latitudeColIndex.toString()})\n - "${latitude_str}"`
        );

    if (isNaN(longitude))
        throw new ParseError(
            `Failed to parse longitude value (Line ${lineNo.toString()}, Column ${longitudeColIndex.toString()})\n - "${longitude_str}"`
        );

    return Position.fromDecimalDegrees(latitude, longitude);
}

function skipRow(
    rowNumber: number,
    firstRow: number,
    lastRow: number,
    takeNthRow: Optional<number>
): boolean {
    return !takeNthRow
        ? false
        : rowNumber == firstRow
        ? false
        : rowNumber == lastRow
        ? false
        : rowNumber % takeNthRow == 0
        ? false
        : true;
}
