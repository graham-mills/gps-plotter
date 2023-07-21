import { MouseEventHandler } from "react";
import Button from "./Button";

export interface DeleteButtonProps {
    onClick: MouseEventHandler;
}

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
    return (
        <Button iconClass="fa-trash-can" title="Delete position" onClick={onClick} />
    );
};

export default DeleteButton;
