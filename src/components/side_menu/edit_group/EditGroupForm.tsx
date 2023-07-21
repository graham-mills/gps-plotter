import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useState } from "react";
import { PositionGroup } from "../../../model/position-group";
import { useDispatch } from "react-redux";
import { updateGroupState } from "../../../store/positions";
import FormHeader from "../form/FormHeader";
import FormInputGroup from "../form/FormInputGroup";
import Form from "../form/Form";
import FormButtonGroup from "../form/FormButtonGroup";

interface EditGroupFormProps {
    group: PositionGroup;
}

const EditGroupForm = ({ group }: EditGroupFormProps) => {
    const [editableGroup, setEditableGroup] = useState({
        ...group,
    });
    const dispatch = useDispatch();
    const [formDataChanged, setFormDataChanged] = useState(false);

    useEffect(() => {
        setFormDataChanged(false);
        setEditableGroup({ ...group });
    }, [group]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        dispatch(
            updateGroupState({
                updatedGroup: editableGroup,
            })
        );
        setFormDataChanged(false);
    };

    const handleReset: MouseEventHandler = (event) => {
        event.stopPropagation();
        setEditableGroup({
            ...group,
        });
        setFormDataChanged(false);
    };

    const handleNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setEditableGroup({
            ...editableGroup,
            name: event.target.value,
        });
        setFormDataChanged(true);
    };

    const handleDrawPolylineChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setEditableGroup({
            ...editableGroup,
            drawPolyline: event.target.checked,
        });
        setFormDataChanged(true);
    };

    const handleLineColorChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setEditableGroup({
            ...editableGroup,
            lineColor: event.target.value,
        });
        setFormDataChanged(true);
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3">
            <FormHeader title={group.name} iconClass="fa-vector-square" />
            <FormInputGroup label="Name">
                <input
                    type="text"
                    className="form-control"
                    value={editableGroup.name}
                    onChange={handleNameChanged}
                />
            </FormInputGroup>
            <FormInputGroup label="Show Polyline">
                <div className="form-control">
                    <input
                        type="checkbox"
                        title="Draw a line connecting group positions"
                        className="form-check-input"
                        checked={editableGroup.drawPolyline}
                        onChange={handleDrawPolylineChanged}
                    />
                </div>
            </FormInputGroup>
            <FormInputGroup label="Polyline Color">
                <input
                    type="color"
                    className="form-control form-control-color"
                    value={editableGroup.lineColor}
                    onChange={handleLineColorChanged}
                />
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

export default EditGroupForm;
