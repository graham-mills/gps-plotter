import { FormEvent, FormEventHandler, ReactNode } from "react";
import classes from "./Form.module.css";

interface FormProps {
    onSubmit: FormEventHandler;
    children: ReactNode;
    className: string;
}

const Form = ({ onSubmit, children, className }: FormProps) => {
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onSubmit(event);
    };

    return (
        <form className={`${classes.form} ${className}`} onSubmit={handleSubmit}>
            {children}
        </form>
    );
};

export default Form;
