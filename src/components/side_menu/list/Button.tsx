import { MouseEvent, MouseEventHandler } from "react";

export interface ButtonProps {
    iconClass: string;
    title: string;
    onClick: MouseEventHandler;
}

const Button = ({ iconClass, title, onClick }: ButtonProps) => {
    const clickHandler = (event: MouseEvent<Element>) => {
        event.stopPropagation();
        onClick(event);
    };

    return (
        <button
            type="button"
            className="btn btn-sm shadow-none"
            title="Delete position"
            onClick={clickHandler}
        >
            <i className={`fa-solid ${iconClass}`}></i>
        </button>
    );
};

export default Button;
