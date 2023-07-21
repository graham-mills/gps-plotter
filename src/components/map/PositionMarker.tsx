import { AppConfig } from "../../config";
import { Position } from "../../model/position";
import { useDispatch } from "react-redux";
import { selectPosition } from "../../store/positions";
import { PositionGroup } from "../../model/position-group";
import { CircleMarker, useMap } from "react-leaflet";
import PositionMarkerLabel from "./PositionMarkerLabel";

interface PositionMarkerProps {
    position: Position;
    group: PositionGroup;
}

const PositionMarker = ({ position, group }: PositionMarkerProps) => {
    const dispatch = useDispatch();
    const map = useMap();
    const handleClick = () => {
        if (position.selected) {
            map.setView([position.latitude, position.longitude]);
        } else {
            dispatch(
                selectPosition({
                    positionId: position.id,
                })
            );
        }
    };

    return (
        <CircleMarker
            key={`${position.id}${position.name}${group.lineColor}${position.latitude}${position.longitude}${position.selected}`}
            eventHandlers={{
                click: (e) => {
                    handleClick();
                },
            }}
            center={[position.latitude, position.longitude]}
            radius={AppConfig.MapMarkerRadius}
            color={group.lineColor}
        >
            <PositionMarkerLabel
                text={position.name}
                selected={position.selected}
                permanent={position.showMapMarkerLabel}
            />
        </CircleMarker>
    );
};

export default PositionMarker;
