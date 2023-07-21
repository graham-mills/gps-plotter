import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useState } from "react";
import { Position } from "../../../model/position";
import Form from "../form/Form";
import classes from "./EditPositionForm.module.css";
import { useDispatch } from "react-redux";
import { updatePositionState } from "../../../store/positions";
import FormInputGroup from "../form/FormInputGroup";
import FormHeader from "../form/FormHeader";
import FormButtonGroup from "../form/FormButtonGroup";

interface EditPositionFormProps {
    position: Position;
}

const EditPositionForm = ({ position }: EditPositionFormProps) => {
    const [latitude, setLatitude] = useState(position.latitude.toString());
    const [longitude, setLongitude] = useState(position.longitude.toString());
    const [editablePosition, setEditablePosition] = useState({
        ...position,
    });
    const dispatch = useDispatch();
    const [formDataChanged, setFormDataChanged] = useState(false);

    useEffect(() => {
        setFormDataChanged(false);
        setEditablePosition({
            ...position,
        });
    }, [position]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        dispatch(
            updatePositionState({
                updatedPosition: editablePosition,
            })
        );
        setFormDataChanged(false);
    };

    const handleReset: MouseEventHandler = (event) => {
        event.stopPropagation();
        setEditablePosition({
            ...position,
        });
        setFormDataChanged(false);
    };

    const handleNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setEditablePosition((lastPosition) => ({
            ...lastPosition,
            name: event.target.value,
        }));
        setFormDataChanged(true);
    };
    const handleLatitudeChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setEditablePosition((lastPosition) => ({
            ...lastPosition,
            latitude: Number(event.target.value),
        }));
        setLatitude(event.target.value);
        setFormDataChanged(true);
    };
    const handleLongitudeChanged = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setEditablePosition((lastPosition) => ({
            ...lastPosition,
            longitude: Number(event.target.value),
        }));
        setLongitude(event.target.value);
        setFormDataChanged(true);
    };
    const handleShowMapMarkerChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setEditablePosition((lastPosition) => ({
            ...lastPosition,
            showMapMarker: event.target.checked,
        }));
        setFormDataChanged(true);
    };
    const handleShowMapMarkerLabelChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setEditablePosition((lastPosition) => ({
            ...lastPosition,
            showMapMarkerLabel: event.target.checked,
        }));
        setFormDataChanged(true);
    };

    return (
        <Form onSubmit={handleSubmit} className={classes["edit-position-form"]}>
            <FormHeader title={position.name} iconClass="fa-location-dot" />
            <FormInputGroup label="Name">
                <input
                    type="text"
                    className="form-control"
                    value={editablePosition.name}
                    onChange={handleNameChanged}
                />
            </FormInputGroup>
            <FormInputGroup label="Latitude">
                <input
                    type="number"
                    className="form-control"
                    value={latitude}
                    onChange={handleLatitudeChanged}
                    min="-90.0"
                    max="90.0"
                    step="0.00000001"
                />
            </FormInputGroup>
            <FormInputGroup label="Longitude">
                <input
                    type="number"
                    className="form-control"
                    value={longitude}
                    onChange={handleLongitudeChanged}
                    min="-360.0"
                    max="360.0"
                    step="0.00000001"
                />
            </FormInputGroup>
            <FormInputGroup label="Show Map Marker">
                <div className="form-control">
                    <input
                        type="checkbox"
                        title="Show a map marker for this position"
                        className="form-check-input"
                        checked={editablePosition.showMapMarker}
                        onChange={handleShowMapMarkerChanged}
                    />
                </div>
            </FormInputGroup>
            <FormInputGroup label="Show Marker Label">
                <div className="form-control">
                    <input
                        type="checkbox"
                        title="Show a label for the map marker"
                        className="form-check-input"
                        checked={editablePosition.showMapMarkerLabel}
                        onChange={handleShowMapMarkerLabelChanged}
                    />
                </div>
            </FormInputGroup>
            <FormButtonGroup>
                <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={!formDataChanged}
                >
                    Apply
                </button>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={handleReset}
                    disabled={!formDataChanged}
                >
                    Reset
                </button>
            </FormButtonGroup>
        </Form>
    );
};

export default EditPositionForm;
