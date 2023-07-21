import { ReactNode } from "react";
import classes from "./Text.module.css";

interface TextProps {
    children: ReactNode;
}

const Text = ({ children }: TextProps) => {
    return (
        <div className={classes["text-wrapper"]}>
            <span className={classes["text"]}>{children}</span>
        </div>
    );
};

export default Text;
