export class Config {
    // Fixed precision for displayed lat/long values
    LatLongPrecision: number = 5;
    // Default name prefix used when creating new groups
    DefaultGroupNamePrefix = "Group ";
    // Default name prefix used when creating new positions
    DefaultPositionNamePrefix = "Position ";
    // Set of default colours used when creating new groups (cycled)
    DefaultGroupColors: Array<string> = ["#ff0000", "#00ff00", "#0000ff"];
    // When creating a new position after another selected position, defines
    // the delta applied to the lat/long values of the selected position to
    // calculate the new position's lat & long
    NewPositionPositionOffset = -0.001;
    // Default width of group polylines drawn on the map
    DefaultPolylineWidth = 2;
    // Default zoom level of the map
    DefaultZoomLevel = 13;
    // Radius of map markers for positions
    MapMarkerRadius = 4;
    // The max value the map can be zoomed in to
    MaxZoomLevel = 22;
}

export const AppConfig = new Config();
