import { useEffect } from "react";

export default function MessagePopUp({ message, onClose, severity = 'danger' }) {

    useEffect(() => {
        const timer = setTimeout(onClose, 6000);

        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style={{ zIndex: 1001 }}>
            <div className={`toast show align-items-center text-white bg-${severity} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {message}
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose} aria-label="Close"></button>
                </div>
            </div>
        </div>
    )
}