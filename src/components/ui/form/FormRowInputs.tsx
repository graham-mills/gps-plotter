import { ReactNode } from "react";

interface FormRowInputsProps {
    children: ReactNode;
}

const FormRowInputs = ({ children }: FormRowInputsProps) => {
    return <div className="col-sm-10">{children}</div>;
};

export default FormRowInputs;
