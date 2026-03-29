import { useState } from "react";
import MessagePopUp from "../components/MessagePopUp";
import { NotificationContext } from "./NotificationContext";

const initialState = {
    isOpen: false,
    message: "",
    severity: "danger",
}

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState(initialState);

    const showNotification = (message, severity = "danger") => {
        setNotification({
            isOpen: true,
            message,
            severity
        })
    };

    const closeNotification = () => {
        setNotification(initialState)
    }

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}

            {notification.isOpen && (
                <MessagePopUp
                    message={notification.message}
                    severity={notification.severity}
                    onClose={closeNotification}
                />
            )}
        </NotificationContext.Provider>
    )
}