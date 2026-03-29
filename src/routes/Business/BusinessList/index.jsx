import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { BusinessService } from '../../../services/BusinessService';
import LoadingSpinner from '../../../components/Loading';
import styles from '../styles.module.css';
import { AuthContext } from '../../../contexts/AuthContext';
import BusinessCard from '../../../components/BusinessCard';
import { UserService } from '../../../services/UserService';
import { useNotification } from '../../../hooks/useNotification';

export default function BusinessList() {
    const { showNotification } = useNotification();
    const { categoryKey } = useParams();
    const location = useLocation();

    const displayName = location.state?.categoryDisplayName || categoryKey;

    const [businesses, setBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [favoriteIds, setFavoriteIds] = useState([]);

    const { user, isLoggedIn } = useContext(AuthContext);

    const businessService = new BusinessService();
    const userService = new UserService();

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!categoryKey) return;

            setIsLoading(true);
            const result = await businessService.getBusinessesByCategory(categoryKey);
            
            if (isLoggedIn && user?.id) {
                const resultFavorites = await userService.getFavoriteBusinesses();
                if (resultFavorites.success) {
                    const ids = resultFavorites.data.map(fav => fav.id);
                    setFavoriteIds(ids);
                }
            }

            if (result.success) {
                setBusinesses(result.data);
            } else {
                showNotification(result.message || `Não foi possível carregar negócios em ${categoryKey}.`)
            }
            setIsLoading(false);
        };

        fetchBusinesses();
    }, [categoryKey, isLoggedIn, user?.id]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="list-container">
            <h1 className={styles.categoryTitle}>Negócios em: {displayName}</h1>
            <p className={styles.resultCount}>{businesses.length} resultado(s) encontrado(s)</p>

            <div className={styles.businessGrid}>
                {businesses.length > 0 ? (
                businesses.map((business) => {
                    const isFav = favoriteIds.includes(business.id);

                    return (
                        <BusinessCard
                            key={`${business.id}-${isFav}`}
                            business={business}
                            defaultFavorited={isFav}
                        />
                    );
                })
            ) : (
                <p className="no-data">Nenhum negócio cadastrado nesta categoria.</p>
            )}
            </div>
        </div>
    );
}