import { ReactNode } from "react";
import classes from "./Panel.module.css";

interface PanelProps {
    children: ReactNode;
}

const Panel = ({ children }: PanelProps) => {
    return <div className={`${classes.panel}`}>{children}</div>;
};

export default Panel;
