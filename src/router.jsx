import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Login from "./routes/Login"; 
import Register from "./routes/User/Register";
import Home from "./routes/Home";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />
            }
        ]
    }
]);

export default router;