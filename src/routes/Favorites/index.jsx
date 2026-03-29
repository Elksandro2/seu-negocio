import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import MinhaConta from '../../components/MinhaConta';
import Loading from '../../components/Loading';
import BusinessCard from '../../components/BusinessCard';
import { UserService } from '../../services/UserService';
import { useNotification } from '../../hooks/useNotification';

export default function Favorites() {
    const { showNotification } = useNotification()

    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const userService = new UserService();

    useEffect(() => {
        const fetchFavorites = async () => {
            const response = await userService.getFavoriteBusinesses();
            
            if (response.success) {
                setFavorites(response.data);
            } else {
                showNotification(response.message || "Erro ao carregar favoritos. Tente novamente.");
            }
            
            setIsLoading(false); 
        };

        fetchFavorites();
    }, []);

    const removeFavoriteFromList = (id) => {
        setFavorites(prev => prev.filter(b => b.id !== id));
    };

    if (isLoading) return <Loading />;

    return (
        <div>
            <div className={styles.profileOptions}>
                <MinhaConta />
            </div>

            <div className={styles.favoritesContainer}>
                <h2 className="category-title">Meus Favoritos</h2>
                
                {favorites.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Você ainda não possui negócios favoritos.</p>
                    </div>
                ) : (
                    <div>
                        {favorites.map(business => (
                            <div key={`${business.id}-fav`} className="mb-3">
                                <BusinessCard business={business} defaultFavorited={true} onUnfavorite={removeFavoriteFromList} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}