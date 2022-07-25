import { EventBus, WaypointSelectedEvent } from "../events";
import * as L from "leaflet";
import { Model } from "../model/model";
import { AppConfig } from "../config";
import { Waypoint } from "../model/waypoint";
import { WaypointGroup } from "../model/waypoint_group";
import { MapInterface } from "./map_interface";

export class LeafletMap implements MapInterface {
    eventBus: EventBus;
    model: Model;
    map: L.Map;
    markers: Map<number, L.Marker>; // Maps WaypointId => Marker
    layerGroups: Map<number, L.FeatureGroup>; // Maps WaypointGroupId => LayerGroup
    lines: Map<number, L.Polyline>; // Maps WaypointGroupId => Polyline

    constructor(eventBus: EventBus, model: Model) {
        this.eventBus = eventBus;
        this.model = model;
        this.markers = new Map<number, L.Marker>();
        this.layerGroups = new Map<number, L.FeatureGroup>();
        this.lines = new Map<number, L.Polyline>();
        this.map = L.map(AppConfig.DOMSymbols.Map, {
            attributionControl: false,
        }).setView([56.0705, -2.748201], 13);
        this.initMap();
    }
    //#region public methods
    addWaypoint(waypoint: Waypoint): void {
        if (this.markers.has(waypoint.id)) {
            console.error("Marker already exists for Waypoint " + waypoint.id);
            return;
        }

        const group = waypoint.group!;
        if (group.showMarkers()) {
            this.addWaypointMarker(waypoint, group);
        }

        let polyline = this.lookupPolyline(group.id);
        polyline?.addLatLng(this.latLngFromWaypoint(waypoint));
        polyline?.redraw();
    }
    addWaypointGroup(group: WaypointGroup): void {
        if (this.layerGroups.has(group.id)) {
            console.error("LayerGroup already exists for WaypointGroup " + group.id);
            return;
        }

        this.addWaypointLayerGroup(group);
        if (group.showMarkers()) {
            for (const waypoint of group.waypoints()) {
                this.addWaypointMarker(waypoint, group);
            }
        }
        if (group.drawPolyline()) {
            this.addWaypointGroupPolyline(group);
        }
    }
    removeWaypoint(waypoint: Waypoint) {
        const waypointMarker = this.lookupMarker(waypoint.id);
        if (!waypointMarker) return;
        this.removeWaypointMarker(waypoint.id);
        this.removeWaypointGroupPolyline(waypoint.group!.id);
        if (waypoint.group!.drawPolyline()) {
            this.addWaypointGroupPolyline(waypoint.group!);
        }
    }
    removeWaypointGroup(group: WaypointGroup) {
        let waypointLayerGroup = this.lookupLayerGroup(group.id);
        if (!waypointLayerGroup) return;
        for (const waypoint of group.waypoints()) {
            this.removeWaypointMarker(waypoint.id);
        }
        this.removeWaypointLayerGroup(group.id);
        this.removeWaypointGroupPolyline(group.id);
    }
    focusOnWaypoint(waypoint: Waypoint) {
        const waypointMarker = this.lookupMarker(waypoint.id);

        if (!waypointMarker) return;
        let requestZoom = this.map.getZoom();
        if (requestZoom < AppConfig.Map.DefaultZoomLevel) {
            requestZoom = AppConfig.Map.DefaultZoomLevel;
        }
        this.map.setView(waypointMarker.getLatLng(), requestZoom);
    }
    focusOnWaypointGroup(group: WaypointGroup) {
        if (group.waypoints.length == 0) return;
        const polyline = this.lookupPolyline(group.id);
        if (!polyline || polyline?.getLatLngs().length == 0) return;
        this.map.fitBounds(polyline.getBounds());
    }
    waypointSelected(waypoint: Waypoint): void {
        // Add the selected class to the map marker div
        const waypointMapMarkerDiv = document.getElementById(
            "marker-" + waypoint.id.toString()
        );
        if (waypointMapMarkerDiv) {
            waypointMapMarkerDiv.className = AppConfig.Map.SelectedMapMarkerClass;
        }
    }
    waypointDeselected(waypoint: Waypoint): void {
        // Remove the selected class from the map marker div
        const waypointMapMarker = document.getElementById(
            "marker-" + waypoint.id.toString()
        );
        if (waypointMapMarker) {
            waypointMapMarker.className = AppConfig.Map.MapMarkerClass;
        }
    }
    waypointGroupSelected(group: WaypointGroup): void {
        const polyline = this.lookupPolyline(group.id);
        if (polyline) {
            polyline.setStyle({
                color: group.lineColor(),
                weight: AppConfig.Map.SelectedPolylineWidth,
            });
        }
    }
    waypointGroupDeselected(group: WaypointGroup): void {
        const polyline = this.lookupPolyline(group.id);
        if (polyline) {
            polyline.setStyle({
                color: group.lineColor(),
                weight: AppConfig.Map.DefaultPolylineWidth,
            });
        }
    }
    getCenterLatLng(): [number, number] {
        const center = this.map.getCenter();
        return [center.lat, center.lng];
    }
    //#endregion
    private initMap() {
        L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
            {
                attribution: "",
                maxZoom: AppConfig.Map.MaxZoomLevel,
                id: "mapbox/streets-v11",
                tileSize: 512,
                zoomOffset: -1,
                accessToken:
                    "pk.eyJ1IjoiZ21pbGxzIiwiYSI6ImNsMDQweXYzNTBkMXkzcXBkaXFwZW5wYXgifQ.YzuUFNKB7DwY9G9bQ4oVmg",
            }
        ).addTo(this.map);
    }
    private lookupMarker(waypointId: number): Optional<L.Marker> {
        const marker = this.markers.get(waypointId);
        if (!marker) {
            return null;
        }
        return marker;
    }
    private lookupLayerGroup(groupId: number): Optional<L.LayerGroup> {
        const layerGroup = this.layerGroups.get(groupId);
        if (!layerGroup) {
            return null;
        }
        return layerGroup;
    }
    private lookupPolyline(groupId: number): Optional<L.Polyline> {
        const polyline = this.lines.get(groupId);
        if (!polyline) {
            return null;
        }
        return polyline;
    }
    private addWaypointGroupPolyline(group: WaypointGroup): L.Polyline {
        const polyline = L.polyline([]);
        this.lookupLayerGroup(group.id)?.addLayer(polyline);
        this.lines.set(group.id, polyline);

        polyline.setStyle({
            color: group.lineColor(),
            weight: AppConfig.Map.DefaultPolylineWidth,
        });

        // Set polyline points from waypoints
        let latLngs: Array<L.LatLngExpression> = [];
        for (const waypoint of group.waypoints()) {
            latLngs.push(this.latLngFromWaypoint(waypoint));
        }
        polyline.setLatLngs(latLngs);
        return polyline;
    }
    private addWaypointMarker(waypoint: Waypoint, group: WaypointGroup): L.Marker {
        const marker = L.marker(this.latLngFromWaypoint(waypoint), {
            title: waypoint.name(),
            icon: this.markerIconForWaypoint(waypoint, group),
        });
        this.lookupLayerGroup(group.id)!.addLayer(marker);
        this.markers.set(waypoint.id, marker);
        this.addWaypointMarkerClickHandler(waypoint);
        return marker;
    }
    private addWaypointLayerGroup(waypointGroup: WaypointGroup): L.LayerGroup {
        const layerGroup = new L.FeatureGroup([], {}).addTo(this.map);
        this.layerGroups.set(waypointGroup.id, layerGroup);
        return layerGroup;
    }
    private removeWaypointMarker(waypointId: number) {
        this.markers.get(waypointId)?.remove();
        this.markers.delete(waypointId);
    }
    private removeWaypointLayerGroup(groupId: number) {
        this.layerGroups.get(groupId)?.clearLayers();
        this.layerGroups.get(groupId)?.remove();
        this.layerGroups.delete(groupId);
    }
    private removeWaypointGroupPolyline(groupId: number) {
        this.lines.get(groupId)?.remove();
        this.lines.delete(groupId);
    }
    private latLngFromWaypoint(waypoint: Waypoint): L.LatLngExpression {
        return [waypoint.position().latitude(), waypoint.position().longitude()];
    }
    private divIdFromWaypoint(waypoint: Waypoint): string {
        return "marker-" + waypoint.id.toString();
    }
    private markerIconForWaypoint(waypoint: Waypoint, group: WaypointGroup) {
        let markerHtml = `<div id="${
            AppConfig.Map.MapMarkerIdPrefix + waypoint.id.toString()
        }" class="${AppConfig.Map.MapMarkerClass}">`;
        markerHtml += `<div class="waypoint-icon" style="background-color: ${group.lineColor()}"></div>`;
        markerHtml += `<div class="waypoint-label">${waypoint.name()}</div>`;
        markerHtml += `</div>`;
        return L.divIcon({ html: markerHtml });
    }
    private addWaypointMarkerClickHandler(waypoint: Waypoint) {
        let that = this;
        document
            .getElementById(this.divIdFromWaypoint(waypoint))
            ?.addEventListener("click", function (event: MouseEvent) {
                that.waypointMarkerClicked(waypoint.id);
            });
    }
    private waypointMarkerClicked(waypointId: number) {
        this.eventBus.publish(
            new WaypointSelectedEvent(this.model.lookupWaypointById(waypointId)!)
        );
    }
}
