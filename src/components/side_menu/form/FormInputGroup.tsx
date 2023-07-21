import { ReactNode } from "react";

interface FormInputGroupProps {
    label: string;
    children: ReactNode;
}

const FormInputGroup = ({ label, children }: FormInputGroupProps) => {
    return (
        <div className="input-group input-group-sm mb-2">
            <label className="input-group-text">{label}</label>
            {children}
        </div>
    );
};

export default FormInputGroup;
