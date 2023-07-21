import { ReactNode } from "react";

interface FormButtonGroupProps {
    children: ReactNode;
}

const FormButtonGroup = ({ children }: FormButtonGroupProps) => {
    return <div className="mb-2">{children}</div>;
};

export default FormButtonGroup;
