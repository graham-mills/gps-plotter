import { EventHandler, FormEvent, ReactNode } from "react";

interface FormProps {
    children: ReactNode;
    onSubmit?: EventHandler<FormEvent>;
    className?: string;
}

const Form = ({ children, onSubmit, className = "" }: FormProps) => {
    const handleSubmitEvent = (event: FormEvent) => {
        event.preventDefault();
        if (onSubmit) {
            onSubmit(event);
        }
    };

    return (
        <form className={`${className}`} onSubmit={handleSubmitEvent}>
            {children}
        </form>
    );
};

export default Form;
