import { Outlet } from "react-router-dom";
import Navigation from "../components/navigation/Navigation";
import AlertOverlay from "../components/alerts/AlertOverlay";
import classes from "./RootLayout.module.css";

const RootLayout = () => {
    return (
        <div
            id="app"
            className={`${classes["app-container"]} container-fluid resp-padding`}
        >
            <div className="row">
                <Navigation />
            </div>
            <div className={`${classes["page-wrapper"]} row`}>
                <Outlet />
            </div>
            <AlertOverlay />
        </div>
    );
};

export default RootLayout;
