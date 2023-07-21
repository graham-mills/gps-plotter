import { MouseEventHandler } from "react";

interface ButtonProps {
    iconClass: string;
    className: string;
    label: string;
    title: string;
    onClick: MouseEventHandler;
}

const Button = ({ iconClass, className, label, title, onClick }: ButtonProps) => {
    return (
        <button
            type="button"
            className={`btn btn-sm shadow-none ${className}`}
            title={title}
            onClick={onClick}
        >
            <i className={`inline-icon fa-solid ${iconClass}`}></i>
            {label}
        </button>
    );
};

export default Button;
