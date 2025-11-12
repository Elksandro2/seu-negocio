import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

export default function RootLayout() {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}