import { EventBus, PositionSelectedEvent } from "../events";
import * as L from "leaflet";
import { Model } from "../model/model";
import { AppConfig } from "../config";
import { Position } from "../model/position";
import { PositionGroup } from "../model/position_group";
import { MapInterface } from "./map_interface";

export class LeafletMap implements MapInterface {
    eventBus: EventBus;
    model: Model;
    map: L.Map;
    markers: Map<number, L.Marker>; // Maps PositionId => Marker
    layerGroups: Map<number, L.FeatureGroup>; // Maps PositionGroupId => LayerGroup
    lines: Map<number, L.Polyline>; // Maps PositionGroupId => Polyline

    constructor(eventBus: EventBus, model: Model) {
        this.eventBus = eventBus;
        this.model = model;
        this.markers = new Map<number, L.Marker>();
        this.layerGroups = new Map<number, L.FeatureGroup>();
        this.lines = new Map<number, L.Polyline>();
        this.map = L.map(AppConfig.DOMSymbols.Map, {
            attributionControl: false,
        }).setView([56.0705, -2.748201], 13);
        this.addTileLayersToMap();
    }
    //#region public methods
    addPosition(position: Position): void {
        if (this.markers.has(position.id)) {
            console.error("Marker already exists for Position " + position.id);
            return;
        }

        const group = position.group!;
        if (group.showMarkers()) {
            this.addPositionMarker(position, group);
        }

        let polyline = this.lookupPolyline(group.id);
        polyline?.addLatLng(this.latLngFromPosition(position));
        polyline?.redraw();
    }
    addPositionGroup(group: PositionGroup): void {
        if (this.layerGroups.has(group.id)) {
            console.error("LayerGroup already exists for PositionGroup " + group.id);
            return;
        }

        this.addPositionLayerGroup(group);
        if (group.showMarkers()) {
            for (const position of group.positions()) {
                this.addPositionMarker(position, group);
            }
        }
        if (group.drawPolyline()) {
            this.addPositionGroupPolyline(group);
        }
    }
    removePosition(position: Position) {
        const positionMarker = this.lookupMarker(position.id);
        if (!positionMarker) return;
        this.removePositionMarker(position.id);
        this.removePositionGroupPolyline(position.group!.id);
        if (position.group!.drawPolyline()) {
            this.addPositionGroupPolyline(position.group!);
        }
    }
    removePositionGroup(group: PositionGroup) {
        let positionLayerGroup = this.lookupLayerGroup(group.id);
        if (!positionLayerGroup) return;
        for (const position of group.positions()) {
            this.removePositionMarker(position.id);
        }
        this.removePositionLayerGroup(group.id);
        this.removePositionGroupPolyline(group.id);
    }
    focusOnPosition(position: Position) {
        const positionMarker = this.lookupMarker(position.id);

        if (!positionMarker) return;
        let requestZoom = this.map.getZoom();
        if (requestZoom < AppConfig.Map.DefaultZoomLevel) {
            requestZoom = AppConfig.Map.DefaultZoomLevel;
        }
        this.map.setView(positionMarker.getLatLng(), requestZoom);
    }
    focusOnPositionGroup(group: PositionGroup) {
        if (group.positions.length == 0) return;
        const polyline = this.lookupPolyline(group.id);
        if (!polyline || polyline?.getLatLngs().length == 0) return;
        this.map.fitBounds(polyline.getBounds());
    }
    positionSelected(position: Position): void {
        // Add the selected class to the map marker div
        const positionMapMarkerDiv = document.getElementById(
            "marker-" + position.id.toString()
        );
        if (positionMapMarkerDiv) {
            positionMapMarkerDiv.className = AppConfig.Map.SelectedMapMarkerClass;
        }
    }
    positionDeselected(position: Position): void {
        // Remove the selected class from the map marker div
        const positionMapMarker = document.getElementById(
            "marker-" + position.id.toString()
        );
        if (positionMapMarker) {
            positionMapMarker.className = AppConfig.Map.MapMarkerClass;
        }
    }
    positionGroupSelected(group: PositionGroup): void {
        const polyline = this.lookupPolyline(group.id);
        if (polyline) {
            polyline.setStyle({
                color: group.lineColor(),
                weight: AppConfig.Map.SelectedPolylineWidth,
            });
        }
    }
    positionGroupDeselected(group: PositionGroup): void {
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
    private addTileLayersToMap() {
        const Mapbox = L.tileLayer(
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
        );
        const OpenStreetMap_Mapnik = L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: AppConfig.Map.MaxZoomLevel,
                attribution: "© OpenStreetMap",
            }
        );
        const Stadia_OSMBright = L.tileLayer(
            "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
            {
                maxZoom: AppConfig.Map.MaxZoomLevel,
                attribution:
                    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            }
        );
        const Esri_WorldImagery = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                attribution:
                    "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            }
        );
        const baseMaps = {
            OpenStreetMap: OpenStreetMap_Mapnik,
            Mapbox: Mapbox,
            "Stadia.OSMBright": Stadia_OSMBright,
            "Esri.WorldImagery": Esri_WorldImagery,
        };

        Stadia_OSMBright.addTo(this.map);
        const layerControl = L.control.layers(baseMaps).addTo(this.map);
    }
    private lookupMarker(positionId: number): Optional<L.Marker> {
        const marker = this.markers.get(positionId);
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
    private addPositionGroupPolyline(group: PositionGroup): L.Polyline {
        const polyline = L.polyline([]);
        this.lookupLayerGroup(group.id)?.addLayer(polyline);
        this.lines.set(group.id, polyline);

        polyline.setStyle({
            color: group.lineColor(),
            weight: AppConfig.Map.DefaultPolylineWidth,
        });

        // Set polyline points from positions
        let latLngs: Array<L.LatLngExpression> = [];
        for (const position of group.positions()) {
            latLngs.push(this.latLngFromPosition(position));
        }
        polyline.setLatLngs(latLngs);
        return polyline;
    }
    private addPositionMarker(position: Position, group: PositionGroup): L.Marker {
        const marker = L.marker(this.latLngFromPosition(position), {
            title: position.name(),
            icon: this.markerIconForPosition(position, group),
        });
        this.lookupLayerGroup(group.id)!.addLayer(marker);
        this.markers.set(position.id, marker);
        this.addPositionMarkerClickHandler(position);
        return marker;
    }
    private addPositionLayerGroup(positionGroup: PositionGroup): L.LayerGroup {
        const layerGroup = new L.FeatureGroup([], {}).addTo(this.map);
        this.layerGroups.set(positionGroup.id, layerGroup);
        return layerGroup;
    }
    private removePositionMarker(positionId: number) {
        this.markers.get(positionId)?.remove();
        this.markers.delete(positionId);
    }
    private removePositionLayerGroup(groupId: number) {
        this.layerGroups.get(groupId)?.clearLayers();
        this.layerGroups.get(groupId)?.remove();
        this.layerGroups.delete(groupId);
    }
    private removePositionGroupPolyline(groupId: number) {
        this.lines.get(groupId)?.remove();
        this.lines.delete(groupId);
    }
    private latLngFromPosition(position: Position): L.LatLngExpression {
        return [position.latitude(), position.longitude()];
    }
    private divIdFromPosition(position: Position): string {
        return "marker-" + position.id.toString();
    }
    private markerIconForPosition(position: Position, group: PositionGroup) {
        let markerHtml = `<div id="${
            AppConfig.Map.MapMarkerIdPrefix + position.id.toString()
        }" class="${AppConfig.Map.MapMarkerClass}">`;
        markerHtml += `<div class="position-icon" style="background-color: ${group.lineColor()}"></div>`;
        if (group.showMarkerLabels()) {
            markerHtml += `<div class="position-label">${position.name()}</div>`;
        }
        markerHtml += `</div>`;
        return L.divIcon({ html: markerHtml });
    }
    private addPositionMarkerClickHandler(position: Position) {
        let that = this;
        document
            .getElementById(this.divIdFromPosition(position))
            ?.addEventListener("click", function (event: MouseEvent) {
                that.positionMarkerClicked(position.id);
            });
    }
    private positionMarkerClicked(positionId: number) {
        this.eventBus.publish(
            new PositionSelectedEvent(this.model.lookupPositionById(positionId)!)
        );
    }
}
