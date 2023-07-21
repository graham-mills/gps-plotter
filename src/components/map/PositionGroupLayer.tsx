import { LayerGroup, useMap } from "react-leaflet";
import { PositionGroup } from "../../model/position-group";
import PositionMarker from "./PositionMarker";
import { useEffect } from "react";
import { Position } from "../../model/position";
import PositionGroupPolyline from "./PositionGroupPolyline";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getSelectedGroup, getSelectedPosition } from "../../store/positions/reducers";
import { AppConfig } from "../../config";
import { LatLngTuple } from "leaflet";

interface PositionGroupLayerProps {
    group: PositionGroup;
}

const PositionGroupLayer = ({ group }: PositionGroupLayerProps) => {
    const map = useMap();
    const selectedPosition = useSelector((state: RootState) =>
        state.positions.selectedPositionId ? getSelectedPosition(state.positions) : null
    );
    const selectedGroup = useSelector((state: RootState) =>
        state.positions.selectedGroupId ? getSelectedGroup(state.positions) : null
    );

    useEffect(() => {
        if (!selectedPosition) return;
        const requestZoom =
            map.getZoom() < 10 ? AppConfig.DefaultZoomLevel : map.getZoom();

        map.setView(
            [selectedPosition.latitude, selectedPosition.longitude],
            requestZoom
        );
    }, [selectedPosition, map]);

    useEffect(() => {
        if (!selectedGroup || selectedGroup.positions.length === 0) return;
        const bounds: Array<LatLngTuple> = selectedGroup.positions.map((pos) => [
            pos.latitude,
            pos.longitude,
        ]);
        map.fitBounds(bounds);
    }, [selectedGroup, map]);

    const positionMarkers = group.positions.map(
        (position: Position) =>
            position.showMapMarker && (
                <PositionMarker key={position.id} position={position} group={group} />
            )
    );

    return (
        <LayerGroup>
            {positionMarkers}
            {group.drawPolyline && <PositionGroupPolyline group={group} />}
        </LayerGroup>
    );
};

export default PositionGroupLayer;
