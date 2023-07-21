import { NavLink } from "react-router-dom";
import classes from "./Navigation.module.css";

const Navigation = () => {
    return (
        <nav className={`navbar navbar-expand-sm navbar-dark ${classes["nav"]}`}>
            <div className="container-fluid">
                <span className="navbar-brand">GPS Plotter</span>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                                to="/"
                            >
                                <i className="inline-icon fa-solid fa-map-location-dot"></i>
                                Map
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                                to="/import"
                            >
                                <i className="inline-icon fa-solid fa-file-import"></i>
                                Import Positions
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                                to="/export"
                            >
                                <i className="inline-icon fa-solid fa-file-export"></i>
                                Export Positions
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
