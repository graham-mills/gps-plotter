import { ReactNode } from "react";
import classes from "./Form.module.css";

interface FormButtonGroupProps {
    children: ReactNode;
}

const FormButtonGroup = ({ children }: FormButtonGroupProps) => {
    return (
        <div className="row">
            <div className={classes["form-button-group"]}>{children}</div>
        </div>
    );
};

export default FormButtonGroup;
