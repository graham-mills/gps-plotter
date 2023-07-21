import { useDispatch, useSelector } from "react-redux";
import classes from "./AlertOverlay.module.css";
import AlertBanner from "./AlertBanner";
import { Alert, deleteAlert } from "../../store/alerts";
import { RootState } from "../../store";
import { useCallback } from "react";

const AlertOverlay = () => {
    const alerts = useSelector((state: RootState) => state.alerts.alerts);
    const dispatch = useDispatch();

    const handleAlertExpired = useCallback(
        (alertId: string) => {
            dispatch(
                deleteAlert({
                    alertId,
                })
            );
        },
        [dispatch]
    );

    return (
        <div className={`row ${classes["alert-overlay"]}`}>
            <div className={classes["alert-printer"]}>
                {alerts.map((alert: Alert) => (
                    <AlertBanner
                        key={alert.id}
                        alert={alert}
                        onAlertExpired={handleAlertExpired}
                    />
                ))}
            </div>
        </div>
    );
};

export default AlertOverlay;
