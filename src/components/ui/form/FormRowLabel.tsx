interface FormRowLabelProps {
    title: string;
    subtitle?: string;
}

const FormRowLabel = ({ title, subtitle }: FormRowLabelProps) => {
    return (
        <label className="col-sm-2 col-form-label col-form-label-sm">
            <b>{title}</b>
            {subtitle && <p>{subtitle}</p>}
        </label>
    );
};

export default FormRowLabel;
