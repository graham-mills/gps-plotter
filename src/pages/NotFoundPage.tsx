import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [navigate]);

    return <h2>Page not found, redirecting..</h2>;
};

export default NotFoundPage;
