import { Fragment } from "react";
import Map from "../components/map/Map";
import SideMenu from "../components/side_menu/SideMenu";

const HomePage = () => {
    return (
        <Fragment>
            <Map />
            <SideMenu />
        </Fragment>
    );
};

export default HomePage;
