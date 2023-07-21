import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import PositionGroupLayer from "./PositionGroupLayer";
import { useMapEvents } from "react-leaflet";
import { updateCenter } from "../../store/map";

const PositionGroupLayers = () => {
    const groups = useSelector((state: RootState) => state.positions.groups);
    const dispatch = useDispatch();
    const groupLayers = Object.values(groups).map(
        (group) => group.visible && <PositionGroupLayer key={group.id} group={group} />
    );

    const map = useMapEvents({
        moveend() {
            dispatch(
                updateCenter({
                    center: [map.getCenter().lat, map.getCenter().lng],
                })
            );
        },
    });

    return <Fragment>{groupLayers}</Fragment>;
};

export default PositionGroupLayers;
