import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/HomePage";
import ImportPage from "./pages/ImportPage";
import ExportPage from "./pages/ExportPage";
import { useDispatch } from "react-redux";
import { addPositionGroup } from "./store/positions";
import { createPositionGroup, PositionGroup } from "./model/position-group";
import { AppDispatch } from "./store";
import { createPosition } from "./model/position";
import { useEffect } from "react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "import",
                element: <ImportPage />,
            },
            {
                path: "export",
                element: <ExportPage />,
            },
        ],
    },
]);

function App() {
    const dispatch: AppDispatch = useDispatch();

    // Seed app with dummy data for testing / evaluation
    useEffect(() => {
        const initialPositionGroups: Array<PositionGroup> = [];
        initialPositionGroups.push(
            createPositionGroup([createPosition(56.0705, -2.748201)])
        );
        initialPositionGroups[0].positions[0].name = "Goldfish Island";

        initialPositionGroups.push(
            createPositionGroup([
                createPosition(56.1, -2.74),
                createPosition(56.11, -2.73),
                createPosition(56.12, -2.74),
            ])
        );

        initialPositionGroups.forEach((group: PositionGroup) => {
            dispatch(
                addPositionGroup({
                    group: group,
                })
            );
        });
    }, [dispatch]);

    return <RouterProvider router={router}></RouterProvider>;
}

export default App;
