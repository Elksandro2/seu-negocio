import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BusinessService } from '../../../services/BusinessService';
import MessagePopUp from '../../../components/MessagePopUp'; 
import LoadingSpinner from '../../../components/Loading';
import styles from '../styles.module.css';
import ItemCard from '../../../components/ItemCard';

export default function BusinessDetail() {
    const { id } = useParams(); 
    
    const [business, setBusiness] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const businessService = new BusinessService();

    useEffect(() => {
        const fetchBusinessDetail = async () => {
            if (!id) return;

            setIsLoading(true);
            const result = await businessService.getBusinessById(id); 
            
            if (result.success) {
                setBusiness(result.data);
            } else {
                setPopUpMessage(result.message || `Não foi possível carregar os detalhes do negócio.`);
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };

        fetchBusinessDetail();
    }, [id]); 

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!business) {
        return (
            <div className={styles.detailContainer}>
                 <p className={styles.noData}>Negócio não encontrado ou removido.</p>
            </div>
        );
    }
    
    const { name, description, address, logoUrl, items, categoryDisplayName } = business;

    return (
        <div className={styles.detailContainer}>
            <header className={styles.detailHeader}>
                <img src={logoUrl} alt={`Logo ${name}`} className={styles.largeLogo} />
                <div>
                    <h1 className={styles.businessName}>{name}</h1>
                    <p className={styles.businessAddress}>{address}</p>
                    <span className={styles.categoryTag}>{categoryDisplayName}</span>
                </div>
            </header>

            <section className={styles.detailSection}>
                <h2 className={styles.sectionTitle}>Sobre Nós</h2>
                <p className={styles.descriptionText}>{description}</p>
            </section>

            <section className={styles.detailSection}>
                <h2 className={styles.sectionTitle}>Produtos e Serviços ({items.length})</h2>
                
                <div className={styles.itemsGrid}>
                    {items.length > 0 ? (
                        items.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))
                    ) : (
                        <p className={styles.noData}>Nenhum item cadastrado por este negócio.</p>
                    )}
                </div>
            </section>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity="error" />
            )}
        </div>
    );
}