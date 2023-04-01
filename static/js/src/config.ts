class UIConfig {
    // Decimal places shown to the user for latitude and longitude values
    LatLongPrecision: number = 6;
    // CSS class applied when a sortable list item is being dragged
    SortableGhostClass: string = "ghost";
}

class DOMSymbols {
    Application = "app";
    Controls = "controls";
    EditGroupForm = "edit-group-form";
    EditWaypointForm = "edit-waypoint-form";
    ImportModal = "import-modal";
    LoadingScreen = "loading-screen";
    Map = "map";
    ExportModal = "export-modal";
    ResetModal = "reset-modal";
    WaypointGroupList = "group-list";
    WaypointImportSubmitButton = "waypoint-input-submit";
    WaypointImportTextArea = "waypoint-input";
    WaypointListPrefix = "waypoint-list-";
    WaypointRowPrefix = "waypoint-row-";
}

class ModelConfig {
    DefaultGroupNamePrefix = "group-";
    DefaultWaypointNamePrefix = "waypoint-";
    DefaultGroupColors: Array<string> = ["#ff0000", "#00ff00", "#0000ff"];
    NewWaypointPositionOffset = -0.001;
}

class MapConfig {
    MaxZoomLevel = 22;
    DefaultZoomLevel = 10;
    MapMarkerClass = "waypoint-marker";
    SelectedMapMarkerClass = "waypoint-marker selected";
    MapMarkerIdPrefix = "marker-";
    DefaultPolylineWidth = 2;
    SelectedPolylineWidth = 3;
}

class Config {
    UI = new UIConfig();
    DOMSymbols = new DOMSymbols();
    Model = new ModelConfig();
    Map = new MapConfig();
}

export const AppConfig = new Config();
