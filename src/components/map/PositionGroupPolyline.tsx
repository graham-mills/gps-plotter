import { Polyline } from "react-leaflet";
import { PositionGroup } from "../../model/position-group";
import { AppConfig } from "../../config";

interface PositionGroupPolylineProps {
    group: PositionGroup;
}

const PositionGroupPolyline = ({ group }: PositionGroupPolylineProps) => {
    return (
        <Polyline
            key={`${group.id}${group.lineColor}`}
            color={group.lineColor}
            positions={group.positions.map((pos) => [pos.latitude, pos.longitude])}
            interactive={false}
            weight={AppConfig.DefaultPolylineWidth}
        />
    );
};

export default PositionGroupPolyline;
