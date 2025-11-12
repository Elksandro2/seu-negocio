import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Login from "./routes/Login"; 
import Register from "./routes/User/Register";
import Home from "./routes/Home";
import BusinessList from "./routes/Business/BusinessList";

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
            },
            {
                path: "category/:categoryKey",
                element: <BusinessList />
            },
        ]
    }
]);

export default router;