import { useContext } from 'react';
import { NotificationProvider } from '../contexts/NotificationContext';

export function useNotification() {
    const context = useContext(NotificationProvider);

    if (!context) {
        throw new Error("useNotification deve ser usado dentro de um NotificationProvider");
    }

    return context;
}