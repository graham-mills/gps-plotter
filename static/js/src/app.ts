require("bootstrap");
import { LeafletMap } from "./map/leaflet_map";
import { WaypointGroup } from "./model/waypoint_group";
import { Waypoint } from "./model/waypoint";
import { Model } from "./model/model";
import { EventBus } from "./events";
import { AddWaypointGroupEvent } from "./events";
import { ModelManager } from "./model_manager";
import { MapManager } from "./map_manager";
import { GroupList } from "./viewmodels/group_list";
import { ControlsViewModel } from "./viewmodels/controls";
import { EditWaypointForm } from "./viewmodels/edit_waypoint_form";
import { EditWaypointGroupForm } from "./viewmodels/edit_group_form";
import { ImportForm } from "./viewmodels/import_form";
import { AppConfig } from "./config";
import { WaypointSorter } from "./sorter";

/** Adds some dummy data to the data model for testing / evaluation */
function seedModel(eventBus: EventBus) {
    let group1 = WaypointGroup.makeUnique();
    let goldfishIsland = Waypoint.fromDecimalDegrees(56.0705, -2.748201);
    goldfishIsland.name("Goldfish Island");
    group1.addWaypoint(goldfishIsland);

    let group2 = WaypointGroup.makeUnique();
    group2.addWaypoint(Waypoint.fromDecimalDegrees(56.1, -2.74));
    group2.addWaypoint(Waypoint.fromDecimalDegrees(56.11, -2.73));
    group2.addWaypoint(Waypoint.fromDecimalDegrees(56.12, -2.74));

    eventBus.publish(new AddWaypointGroupEvent(group1));
    eventBus.publish(new AddWaypointGroupEvent(group2));
}

export function init() {
    let eventBus = new EventBus();
    let model = new Model();
    let map = new LeafletMap(eventBus, model);
    let modelManager = new ModelManager(eventBus, model);
    let mapManager = new MapManager(eventBus, map);
    let sorter = new WaypointSorter(eventBus, model);

    // Construct view models
    let groupList = new GroupList(eventBus, model);
    let controlsViewModel = new ControlsViewModel(eventBus);
    let editWaypointForm = new EditWaypointForm(eventBus);
    let editGroupForm = new EditWaypointGroupForm(eventBus);
    let importForm = new ImportForm(eventBus, model);

    seedModel(eventBus);
}

init();
