import { ChangeEvent, useEffect, useState, MouseEvent, useCallback } from "react";
import Form from "../ui/form/Form";
import FormHeader from "../ui/form/FormHeader";
import FormRow from "../ui/form/FormRow";
import FormRowInputs from "../ui/form/FormRowInputs";
import FormRowLabel from "../ui/form/FormRowLabel";
import classes from "./ExportForm.module.css";
import FormButtonGroup from "../ui/form/FormButtonGroup";
import { ExportHeader, groupsToCsv } from "../../algs/writeCsv";
import store from "../../store";
import { useDispatch } from "react-redux";
import { showErrorAlert, showSuccessAlert } from "../../store/alerts";

const ExportForm = () => {
    const dispatch = useDispatch();
    const [exportGroupName, setExportGroupName] = useState(true);
    const [exportPositionName, setExportPositionName] = useState(true);
    const [exportLatitude, setExportLatitude] = useState(true);
    const [exportLongitude, setExportLongitude] = useState(true);
    const [csvData, setCsvData] = useState("");

    const generateCsvData = useCallback(() => {
        const exportHeaders: Array<ExportHeader> = [];
        if (exportGroupName) {
            exportHeaders.push(ExportHeader.GroupName);
        }
        if (exportPositionName) {
            exportHeaders.push(ExportHeader.PositionName);
        }
        if (exportLatitude) {
            exportHeaders.push(ExportHeader.Latitude);
        }
        if (exportLongitude) {
            exportHeaders.push(ExportHeader.Longitude);
        }
        if (exportHeaders.length === 0) {
            dispatch(
                showErrorAlert({
                    message: "At least 1 header must be selected for export",
                })
            );
            return;
        }

        const text = groupsToCsv(
            Object.values(store.getState().positions.groups),
            exportHeaders
        );
        setCsvData(text);
    }, [
        dispatch,
        setCsvData,
        exportGroupName,
        exportLatitude,
        exportLongitude,
        exportPositionName,
    ]);

    useEffect(() => {
        generateCsvData();
    }, [generateCsvData]);
    useEffect(() => {
        generateCsvData();
    }, [generateCsvData]);

    const handleCopyToClipboard = (event: MouseEvent) => {
        navigator.clipboard.writeText(csvData);
        dispatch(
            showSuccessAlert({
                message: "Copied position data to clipboard!",
            })
        );
    };

    const handleExportGroupNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setExportGroupName(event.target.checked);
    };
    const handleExportPositionNameChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setExportPositionName(event.target.checked);
    };
    const handleExportLatitudeChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setExportLatitude(event.target.checked);
    };
    const handleExportLongitudeChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setExportLongitude(event.target.checked);
    };

    return (
        <Form className={classes["export-form"]}>
            <FormHeader title="Export Position Data" />
            <FormRow>
                <FormRowLabel title="Choose columns" subtitle="" />
                <FormRowInputs>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={exportGroupName}
                        onChange={handleExportGroupNameChanged}
                    />{" "}
                    Group
                    <br />
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={exportPositionName}
                        onChange={handleExportPositionNameChanged}
                    />{" "}
                    Name
                    <br />
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={exportLatitude}
                        onChange={handleExportLatitudeChanged}
                    />{" "}
                    Latitude
                    <br />
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={exportLongitude}
                        onChange={handleExportLongitudeChanged}
                    />{" "}
                    Longitude
                </FormRowInputs>
            </FormRow>
            <FormRow>
                <textarea
                    className="form-control"
                    rows={15}
                    placeholder=""
                    value={csvData}
                    readOnly={true}
                ></textarea>
            </FormRow>
            <FormButtonGroup>
                <button
                    className={`btn btn-xl btn-success`}
                    onClick={handleCopyToClipboard}
                >
                    <i className="inline-icon fa-solid fa-clipboard"></i>
                    Copy to Clipboard
                </button>
            </FormButtonGroup>
        </Form>
    );
};

export default ExportForm;
