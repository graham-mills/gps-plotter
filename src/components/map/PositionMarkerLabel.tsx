import { Tooltip } from "react-leaflet";
import classes from "./PositionMarkerLabel.module.css";

interface PositionMarkerLabelProps {
    text: string;
    selected: boolean;
    permanent: boolean;
}

const PositionMarkerLabel = ({
    text,
    selected,
    permanent,
}: PositionMarkerLabelProps) => {
    return (
        <Tooltip
            key={`${text}${selected}${permanent}`}
            className={`${classes["position-marker-label"]} ${
                selected ? classes.selected : ""
            }`}
            interactive={true}
            direction="right"
            offset={[5, 0]}
            permanent={permanent || selected}
        >
            {text}
        </Tooltip>
    );
};

export default PositionMarkerLabel;
