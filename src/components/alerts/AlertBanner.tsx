import { useEffect, useRef, MouseEvent } from "react";
import { Alert, AlertType } from "../../store/alerts";
import classes from "./AlertBanner.module.css";

interface AlertBannerProps {
    alert: Alert;
    onAlertExpired: (alertId: string) => void;
}

const AlertBanner = ({ alert, onAlertExpired }: AlertBannerProps) => {
    const alertRef = useRef<HTMLDialogElement>(null);
    const alertStyle =
        alert.type === AlertType.Error ? "alert-danger" : "alert-success";
    const alertIcon =
        alert.type === AlertType.Error ? "fa-circle-exclamation" : "fa-circle-check";

    useEffect(() => {
        // Begin fadeout in 3s (0.5s transition duration), then remove alert after 4s
        const fadeoutTimer = setTimeout(() => {
            if (!alertRef.current) return;
            alertRef.current!.className += ` ${classes.fadeout}`;
        }, 3000);
        const expireTimer = setTimeout(() => {
            onAlertExpired(alert.id);
        }, 4000);
        return () => {
            clearTimeout(fadeoutTimer);
            clearTimeout(expireTimer);
        };
    }, [onAlertExpired, alertRef, alert]);

    const handleUserDismiss = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onAlertExpired(alert.id);
    };

    return (
        <dialog
            open
            ref={alertRef}
            className={`${classes["alert-banner"]} alert alert-dismissible ${alertStyle}`}
            role="alert"
        >
            <i className={`inline-icon fa-solid ${alertIcon}`}></i>
            {alert.message}
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleUserDismiss}
            ></button>
        </dialog>
    );
};

export default AlertBanner;
