class UIConfig {
    // Decimal places shown to the user for latitude and longitude values
    LatLongPrecision: number = 5;
    // CSS class applied when a sortable list item is being dragged
    SortableGhostClass: string = "ghost";
}

class DOMSymbols {
    Controls = "controls";
    EditGroupForm = "edit-group-form";
    EditWaypointForm = "edit-waypoint-form";
    ImportModal = "import-modal";
    Map = "map";
    ResetModal = "reset-modal";
    WaypointGroupList = "group-list";
    WaypointImportModal = "import-modal";
    WaypointImportSubmitButton = "waypoint-input-submit";
    WaypointImportTextArea = "waypoint-input";
    WaypointListPrefix = "waypoint-list-";
}

class ModelConfig {
    DefaultGroupNamePrefix = "group-";
    DefaultWaypointNamePrefix = "waypoint-";
    DefaultGroupColors: Array<string> = ["#ff0000", "#00ff00", "#0000ff"];
    NewWaypointPositionOffset = -0.005;
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
