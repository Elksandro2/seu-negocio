import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { BusinessService } from '../../../services/BusinessService';
import MessagePopUp from '../../../components/MessagePopUp'; 
import LoadingSpinner from '../../../components/Loading';
import styles from '../styles.module.css'; 

export default function BusinessList() {
    const { categoryKey } = useParams();
    const location = useLocation();
    
    const displayName = location.state?.categoryDisplayName || categoryKey;

    const [businesses, setBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const businessService = new BusinessService();

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!categoryKey) return;
            console.log(categoryKey);

            setIsLoading(true);
            const result = await businessService.getBusinessesByCategory(categoryKey);
            console.log(result);
            
            if (result.success) {
                setBusinesses(result.data);
            } else {
                setPopUpMessage(result.message || `Não foi possível carregar negócios em ${categoryKey}.`);
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };

        fetchBusinesses();
    }, [categoryKey]); 

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.listContainer}>
            <h1 className={styles.categoryTitle}>Negócios em: {displayName}</h1>
            <p className={styles.resultCount}>{businesses.length} resultado(s) encontrado(s)</p>
            
            <div className={styles.businessGrid}>
                {businesses.length > 0 ? (
                    businesses.map((business) => (
                        <Link 
                            key={business.id} 
                            to={`/business/${business.id}`} 
                            className={styles.businessCard}
                        >
                            <img 
                                src={business.logoUrl} 
                                alt={`Logo ${business.name}`} 
                                className={styles.businessLogo} 
                            />
                            <div className={styles.cardInfo}>
                                <h2>{business.name}</h2>
                                <p>{business.address}</p>
                                <span className={styles.categoryTag}>{business.categoryDisplayName}</span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className={styles.noData}>Nenhum negócio cadastrado nesta categoria.</p>
                )}
            </div>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity="error" />
            )}
        </div>
    );
}