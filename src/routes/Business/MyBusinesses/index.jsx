import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BusinessService } from '../../../services/BusinessService';
import { AuthContext } from '../../../contexts/AuthContext';
import MessagePopUp from '../../../components/MessagePopUp'; 
import styles from '../styles.module.css'; 
import Loading from '../../../components/Loading';

export default function MyBusinesses() {
    const [myBusinesses, setMyBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    
    const navigate = useNavigate();
    const businessService = new BusinessService();
    
    const { user } = useContext(AuthContext); 

    useEffect(() => {
        const fetchMyBusinesses = async () => {
            if (!user?.id) { 
                setIsLoading(false);
                return; 
            }

            const result = await businessService.getMyBusinesses(); 
            
            if (result.success) {
                setMyBusinesses(result.data);
            } else {
                setPopUpMessage(result.message || "Falha ao carregar seus negócios.");
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };

        fetchMyBusinesses();
    }, [user?.id]);

    if (isLoading) {
        return <Loading />; 
    }

    if (myBusinesses.length === 0) {
        return (
            <div className="no-data-container">
                <h1 className={styles.categoryTitle}>Meus Negócios</h1>
                <p>Você ainda não possui nenhum negócio cadastrado.</p>
                <button 
                    onClick={() => navigate('/new-business')} 
                    className={`submitButton ${styles.createButton}`}
                >
                    Cadastrar Meu Primeiro Negócio
                </button>
            </div>
        );
    }
    
    return (
        <div className="list-container">
            <header className="gestion-header">
                <h2 className="category-title">Meus Negócios</h2>
                <Link to="/new-business" className="new-button">
                    + Cadastrar Novo
                </Link>
            </header>

            <div className={styles.businessGrid}>
                {myBusinesses.map((business) => (
                    <div key={business.id} className={styles.gestionCard}>
                        <img src={business.logoUrl} alt={`Logo ${business.name}`} className={styles.gestionLogo} />
                        
                        <div className={styles.cardInfo}>
                            <h2>{business.name}</h2>
                            <span className="category-tag">{business.categoryDisplayName}</span>
                            
                            <div className={styles.gestionActions}>
                                <Link to={`/business/${business.id}`} className={styles.viewLink}>
                                    Ver Loja
                                </Link>
                                
                                <Link to={`/manage-items/${business.id}`} className={styles.manageLink}>
                                    Gerenciar Itens
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}