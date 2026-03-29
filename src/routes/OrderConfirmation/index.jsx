import { useNavigate } from 'react-router-dom';
import { CheckCircleFill } from 'react-bootstrap-icons';
import styles from './styles.module.css';

export default function OrderConfirmation() {
    const navigate = useNavigate();

    return (
        <div className={styles.pageContainer}>
            <div className={styles.successCard}>
                <CheckCircleFill className={styles.icon} />
                
                <h2 className={styles.title}>Pedido Confirmado!</h2>
                <p className={styles.subtitle}>
                    Seu pagamento foi processado e o pedido já foi informado ao vendedor.
                </p>

                <div className={styles.buttonGroup}>
                    <button 
                        className={styles.btnPrimary} 
                        onClick={() => navigate('/orders')}
                    >
                        Ir para Meus Pedidos
                    </button>
                    
                    <button 
                        className={styles.btnSecondary} 
                        onClick={() => navigate('/')}
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        </div>
    );
}