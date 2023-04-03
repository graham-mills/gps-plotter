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
    EditPositionForm = "edit-position-form";
    ImportFormFileSelect = "position-input-long-col-name";
    ImportModal = "import-modal";
    LoadingScreen = "loading-screen";
    Map = "map";
    ExportModal = "export-modal";
    ResetModal = "reset-modal";
    PositionGroupList = "group-list";
    PositionImportSubmitButton = "position-input-submit";
    PositionImportTextArea = "position-input";
    PositionListPrefix = "position-list-";
    PositionRowPrefix = "position-row-";
}

class ModelConfig {
    DefaultGroupNamePrefix = "Group ";
    DefaultPositionNamePrefix = "Position ";
    DefaultGroupColors: Array<string> = ["#ff0000", "#00ff00", "#0000ff"];
    NewPositionPositionOffset = -0.001;
}

class MapConfig {
    MaxZoomLevel = 22;
    DefaultZoomLevel = 10;
    MapMarkerClass = "position-marker";
    SelectedMapMarkerClass = "position-marker selected";
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
