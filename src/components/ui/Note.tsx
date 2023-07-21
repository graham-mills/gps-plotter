import { ReactNode } from "react";

interface NoteProps {
    children: ReactNode;
}

const Note = ({ children }: NoteProps) => {
    return <div className="alert alert-light mt-2">{children}</div>;
};

export default Note;
