import { MouseEvent } from "react";
import { PositionGroup } from "../../../model/position-group";
import { useDispatch } from "react-redux";
import { updateGroupState } from "../../../store/positions";

interface EditGroupTogglesProps {
    group: PositionGroup;
}

const EditGroupToggles = ({ group }: EditGroupTogglesProps) => {
    const dispatch = useDispatch();

    const handleTogglePositionMarkers = (
        event: MouseEvent<HTMLLabelElement>,
        showMarkers: boolean
    ) => {
        event.stopPropagation();
        const updatedGroup = {
            ...group,
            showMarkers: showMarkers,
        };
        dispatch(
            updateGroupState({
                updatedGroup,
            })
        );
    };

    const handleToggleMarkerLabels = (
        event: MouseEvent<HTMLLabelElement>,
        showLabels: boolean
    ) => {
        event.stopPropagation();
        const updatedGroup = {
            ...group,
            showMarkerLabels: showLabels,
        };
        dispatch(
            updateGroupState({
                updatedGroup,
            })
        );
    };

    return (
        <div className="p-3">
            <div className="row mb-2">
                <div className="col-8">Toggle all map markers</div>
                <div className="col-4 btn-group btn-group-sm" role="group">
                    <label
                        className={`btn btn-outline-primary ${
                            group.showMarkers ? "active" : ""
                        }`}
                        onClick={(event) => handleTogglePositionMarkers(event, true)}
                    >
                        On
                    </label>
                    <label
                        className={`btn btn-outline-primary ${
                            !group.showMarkers ? "active" : ""
                        }`}
                        onClick={(event) => handleTogglePositionMarkers(event, false)}
                    >
                        Off
                    </label>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-8">Toggle all map marker labels</div>
                <div className="col-4 btn-group btn-group-sm" role="group">
                    <label
                        className={`btn btn-outline-primary ${
                            group.showMarkerLabels ? "active" : ""
                        }`}
                        onClick={(event) => handleToggleMarkerLabels(event, true)}
                    >
                        On
                    </label>
                    <label
                        className={`btn btn-outline-primary ${
                            !group.showMarkerLabels ? "active" : ""
                        }`}
                        onClick={(event) => handleToggleMarkerLabels(event, false)}
                    >
                        Off
                    </label>
                </div>
            </div>
        </div>
    );
};

export default EditGroupToggles;
