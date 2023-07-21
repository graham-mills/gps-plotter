import {
    ChangeEvent,
    DragEventHandler,
    DragEvent,
    FormEvent,
    Fragment,
    useState,
} from "react";
import classes from "./ImportForm.module.css";
import Form from "../ui/form/Form";
import FormRow from "../ui/form/FormRow";
import FormRowLabel from "../ui/form/FormRowLabel";
import FormRowInputs from "../ui/form/FormRowInputs";
import FormHeader from "../ui/form/FormHeader";
import Note from "../ui/Note";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { generateOrdinalSuffix } from "../../algs/generateOrdinalSuffix";
import FormButtonGroup from "../ui/form/FormButtonGroup";
import { ParseError, positionsFromCsv } from "../../algs/parseCsv";
import { Position } from "../../model/position";
import { showErrorAlert, showSuccessAlert } from "../../store/alerts";
import { PositionGroup, createPositionGroup } from "../../model/position-group";
import {
    addPositionGroup,
    addPositions,
    selectPositionGroup,
} from "../../store/positions";
import { useNavigate } from "react-router-dom";

enum ColumnMappingOption {
    Auto = "Auto",
    SpecifyColumnNames = "SpecifyColumnNames",
}

interface FormData {
    csvData: string;
    validationMessage: Optional<string>;
    columnMapping: ColumnMappingOption;
    latitudeColumnName: string;
    longitudeColumnName: string;
    enableDownSampling: boolean;
    downSamplingAmount: string;
    downSamplingOrdinal: string;
    targetGroupId: string;
}

const ImportForm = () => {
    const [formData, setFormData] = useState<FormData>({
        csvData: "",
        validationMessage: null,
        columnMapping: ColumnMappingOption.Auto,
        latitudeColumnName: "latitude",
        longitudeColumnName: "longitude",
        enableDownSampling: false,
        downSamplingAmount: "5",
        downSamplingOrdinal: "th",
        targetGroupId: "",
    });
    const existingGroups = useSelector((state: RootState) => state.positions.groups);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCsvDataChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((data: FormData) => ({
            ...data,
            csvData: event.target.value,
        }));
    };

    const handleColumnMappingChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        setFormData((data: FormData) => ({
            ...data,
            columnMapping: event.target.value as ColumnMappingOption,
        }));
    };

    const handleLatitudeColumnNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((data: FormData) => ({
            ...data,
            latitudeColumnName: event.target.value,
        }));
    };

    const handleLongitudeColumnNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((data: FormData) => ({
            ...data,
            longitudeColumnName: event.target.value,
        }));
    };

    const handleTargetGroupChanged = (event: ChangeEvent<HTMLSelectElement>) => {
        setFormData((data: FormData) => ({
            ...data,
            targetGroupId: event.target.value,
        }));
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setFormData((data: FormData) => ({
            ...data,
            validationMessage: null,
        }));
        let customLatitudeMapping = null;
        let customLongitudeMapping = null;
        if (formData.columnMapping === ColumnMappingOption.SpecifyColumnNames) {
            customLatitudeMapping = formData.latitudeColumnName;
            customLongitudeMapping = formData.longitudeColumnName;
        }
        const filterSampleSize = formData.enableDownSampling
            ? Number(formData.downSamplingAmount)
            : null;

        try {
            const positions: Array<Position> = positionsFromCsv(
                formData.csvData,
                customLatitudeMapping,
                customLongitudeMapping,
                filterSampleSize
            );

            let group: Optional<PositionGroup> = null;
            if (formData.targetGroupId) {
                group = existingGroups[formData.targetGroupId];
                positions.forEach((pos) => {
                    pos.groupId = group!.id;
                });
                dispatch(
                    addPositions({
                        positions,
                    })
                );
            } else {
                group = createPositionGroup(positions);
                dispatch(
                    addPositionGroup({
                        group,
                    })
                );
            }
            dispatch(
                showSuccessAlert({
                    message: `Imported ${positions.length} positions to ${group!.name}`,
                })
            );
            dispatch(
                selectPositionGroup({
                    groupId: group!.id,
                })
            );
            navigate("/");
        } catch (error) {
            if (error instanceof ParseError) {
                dispatch(
                    showErrorAlert({
                        message: (error as ParseError).message,
                    })
                );
                setFormData((data: FormData) => ({
                    ...data,
                    validationMessage: (error as ParseError).message,
                }));
            } else {
                throw error;
            }
        }
    };

    const handleEnableDownSamplingChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((data: FormData) => ({
            ...data,
            enableDownSampling: event.target.checked,
        }));
    };

    const handleDownSamplingAmountChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((data: FormData) => ({
            ...data,
            downSamplingAmount: event.target.value,
            downSamplingOrdinal: generateOrdinalSuffix(Number(event.target.value)),
        }));
    };

    const handleFileDropped: DragEventHandler = (event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setFormData((data: FormData) => ({
                    ...data,
                    csvData: fileReader.result as string,
                }));
            };
            fileReader.readAsText(file);
        }
    };

    let csvDataPlaceholder = "";
    if (formData.columnMapping === ColumnMappingOption.SpecifyColumnNames) {
        csvDataPlaceholder += `${formData.latitudeColumnName}, ${formData.longitudeColumnName}\n`;
    }
    csvDataPlaceholder += "48.858093, 2.294694";

    return (
        <Form onSubmit={handleSubmit} className={classes["import-form"]}>
            <FormHeader title="Import Position Data" />
            <FormRow>
                <FormRowLabel
                    title="CSV Data"
                    subtitle="Drag-and-drop a .csv file into the box or paste in your data manually"
                ></FormRowLabel>
                <FormRowInputs>
                    <textarea
                        className="form-control"
                        rows={10}
                        placeholder={csvDataPlaceholder}
                        value={formData.csvData}
                        onChange={handleCsvDataChanged}
                        onDrop={handleFileDropped}
                    ></textarea>
                    {formData.validationMessage && (
                        <div className="alert alert-danger mt-2">
                            <i className="fa-solid fa-circle-exclamation"></i>{" "}
                            {formData.validationMessage}
                        </div>
                    )}
                    <Note>
                        <ul>
                            <li>Data must be formatted as comma separated values</li>
                            <li>
                                Latitude & longitude values must be provided in decimal
                                degrees
                            </li>
                            <li>
                                As a minimum, there must be a column for{" "}
                                <code>latitude</code> values and a column for{" "}
                                <code>longitude</code> values
                            </li>
                            <li>
                                The header row may be omitted if the data contains only
                                2 columns: <code>latitude,longitude</code>
                            </li>
                        </ul>
                    </Note>
                </FormRowInputs>
            </FormRow>
            <FormRow>
                <FormRowLabel
                    title="Column Mapping"
                    subtitle="Select which columns to read coordinates from"
                />
                <FormRowInputs>
                    <Fragment>
                        <select
                            className="form-select"
                            onChange={handleColumnMappingChanged}
                            value={formData.columnMapping}
                        >
                            <option value={ColumnMappingOption.Auto}>Auto</option>
                            <option value={ColumnMappingOption.SpecifyColumnNames}>
                                Specify column names
                            </option>
                        </select>
                        {formData.columnMapping === ColumnMappingOption.Auto && (
                            <Note>
                                <ul className="">
                                    <li>
                                        Coordinates will attempted to be read from the
                                        columns named <code>latitude</code> and{" "}
                                        <code>longitude</code>
                                    </li>
                                    <li>
                                        If those column headers are not found, then the
                                        values will attempted to be read from the first
                                        two columns
                                    </li>
                                </ul>
                            </Note>
                        )}
                        {formData.columnMapping ===
                            ColumnMappingOption.SpecifyColumnNames && (
                            <Note>
                                Coordinates will attempted to be read from the columns
                                specified below (
                                <code>{formData.latitudeColumnName}</code> and{" "}
                                <code>{formData.longitudeColumnName}</code>)
                            </Note>
                        )}
                        {formData.columnMapping ===
                            ColumnMappingOption.SpecifyColumnNames && (
                            <Fragment>
                                <div className="row mb-2">
                                    <div className="col-sm-2"></div>
                                    <label className="col-sm-2 col-form-label col-form-label-sm">
                                        <b>Latitude Column</b>
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.latitudeColumnName}
                                            onChange={handleLatitudeColumnNameChanged}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-2"></div>
                                    <label className="col-sm-2 col-form-label col-form-label-sm">
                                        <b>Longitude Column</b>
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.longitudeColumnName}
                                            onChange={handleLongitudeColumnNameChanged}
                                        />
                                    </div>
                                </div>
                            </Fragment>
                        )}
                    </Fragment>
                </FormRowInputs>
            </FormRow>
            <FormRow>
                <FormRowLabel
                    title="Group Option"
                    subtitle="Choose the group for the imported positions"
                />
                <FormRowInputs>
                    <select
                        className="form-select"
                        value={formData.targetGroupId}
                        onChange={handleTargetGroupChanged}
                    >
                        <option value="">Add as a new group</option>
                        <optgroup label="Existing groups:">
                            {Object.values(existingGroups).map((group) => (
                                <option
                                    key={group.id}
                                    value={group.id}
                                >{`Add to ${group.name}`}</option>
                            ))}
                        </optgroup>
                    </select>
                </FormRowInputs>
            </FormRow>
            <FormRow>
                <FormRowLabel
                    title="Enable Downsampling"
                    subtitle="Filters the total number of positions that are imported. This may improve application performance for larger datasets."
                />
                <FormRowInputs>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.enableDownSampling}
                        onChange={handleEnableDownSamplingChanged}
                    />
                    {formData.enableDownSampling && (
                        <div>
                            Take every{" "}
                            <input
                                type="number"
                                className={`${classes["import-form__downsampling-input"]}`}
                                placeholder="2"
                                value={formData.downSamplingAmount}
                                onChange={handleDownSamplingAmountChanged}
                                min="2"
                            />
                            {formData.downSamplingOrdinal} position. The <i>first</i>{" "}
                            and <i>last</i> position in the dataset will always be
                            imported.
                        </div>
                    )}
                </FormRowInputs>
            </FormRow>
            <FormButtonGroup>
                <button
                    className={`${classes["submit-button"]} btn btn-xl btn-success`}
                >
                    <i className="inline-icon fa-solid fa-file-import"></i>
                    Start Import
                </button>
            </FormButtonGroup>
        </Form>
    );
};

export default ImportForm;
