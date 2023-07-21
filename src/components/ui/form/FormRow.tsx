import { ReactNode } from "react";
import classes from "./Form.module.css";

interface FormRowProps {
    children: ReactNode;
}

const FormRow = ({ children }: FormRowProps) => {
    return (
        <div className={`${classes["form-row"]} row mx-1 my-2 pb-2`}>{children}</div>
    );
};

export default FormRow;
