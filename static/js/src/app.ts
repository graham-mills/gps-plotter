require("bootstrap");
require("../../css/app.css");
import { LeafletMap } from "./map/leaflet_map";
import { PositionGroup } from "./model/position_group";
import { Position } from "./model/position";
import { Model } from "./model/model";
import { EventBus, AppInitialisedEvent } from "./events";
import { AddPositionGroupEvent } from "./events";
import { ModelManager } from "./model_manager";
import { MapManager } from "./map_manager";
import { GroupList } from "./viewmodels/group_list";
import { ControlsViewModel } from "./viewmodels/controls";
import { EditPositionForm } from "./viewmodels/edit_position_form";
import { EditPositionGroupForm } from "./viewmodels/edit_group_form";
import { ImportForm } from "./viewmodels/import_form";
import { ExportForm } from "./viewmodels/export_form";
import { AppConfig } from "./config";
import { PositionSorter } from "./sorter";
import { LoadingScreen } from "./loading_screen";

/** Adds some dummy data to the data model for testing / evaluation */
function seedModel(eventBus: EventBus) {
    let group1 = PositionGroup.makeUnique();
    let goldfishIsland = Position.fromDecimalDegrees(56.0705, -2.748201);
    goldfishIsland.name("Goldfish Island");
    group1.addPosition(goldfishIsland);

    let group2 = PositionGroup.makeUnique();
    group2.addPosition(Position.fromDecimalDegrees(56.1, -2.74));
    group2.addPosition(Position.fromDecimalDegrees(56.11, -2.73));
    group2.addPosition(Position.fromDecimalDegrees(56.12, -2.74));

    eventBus.publish(new AddPositionGroupEvent(group1));
    eventBus.publish(new AddPositionGroupEvent(group2));
}

export function init() {
    let eventBus = new EventBus();
    let model = new Model();
    let map = new LeafletMap(eventBus, model);
    let modelManager = new ModelManager(eventBus, model);
    let mapManager = new MapManager(eventBus, map);
    let sorter = new PositionSorter(eventBus, model);
    let loadingScreen = new LoadingScreen(eventBus);

    // Construct view models
    let groupList = new GroupList(eventBus, model);
    let controlsViewModel = new ControlsViewModel(eventBus, map);
    let editPositionForm = new EditPositionForm(eventBus);
    let editGroupForm = new EditPositionGroupForm(eventBus);
    let importForm = new ImportForm(eventBus, model);
    let exportForm = new ExportForm(eventBus, model);

    seedModel(eventBus);
    eventBus.publish(new AppInitialisedEvent());
}

init();
