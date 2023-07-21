interface FormHeaderProps {
    title: string;
    iconClass: string;
}

const FormHeader = ({ title, iconClass }: FormHeaderProps) => {
    return (
        <div className="mb-3">
            <h5>
                {iconClass && <i className={`inline-icon fa-solid ${iconClass}`}></i>}
                <span>{title}</span>
            </h5>
        </div>
    );
};

export default FormHeader;
