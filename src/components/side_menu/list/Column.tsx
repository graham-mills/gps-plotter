import { ReactNode } from "react";

export interface ColumnProps {
    children: ReactNode;
    width: number;
}

const Column = ({ children, width }: ColumnProps) => {
    return <div className={`col-${width}`}>{children}</div>;
};

export default Column;
