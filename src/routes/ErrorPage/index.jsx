import { useRouteError, Link } from 'react-router-dom';
import styles from './styles.module.css';

export default function ErrorPage() {
    const error = useRouteError(); 
    
    const errorMessage = error?.statusText || error?.message || "Ocorreu um erro inesperado.";
    const statusCode = error?.status || 500;

    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorCard}>
                <h2 className={styles.errorCode}>{statusCode}</h2>
                <h2 className={styles.errorTitle}>Ops! Algo deu errado.</h2>
                
                <p className={styles.errorMessage}>
                    {errorMessage}
                </p>

                <Link to="/" className={styles.homeButton}>
                    Voltar para o Marketplace
                </Link>
            </div>
        </div>
    );
}