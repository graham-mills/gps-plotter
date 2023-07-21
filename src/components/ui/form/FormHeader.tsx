import FormRow from "./FormRow";

interface FormHeaderProps {
    title: string;
}

const FormHeader = ({ title }: FormHeaderProps) => {
    return (
        <FormRow>
            <h4>{title}</h4>
        </FormRow>
    );
};

export default FormHeader;
