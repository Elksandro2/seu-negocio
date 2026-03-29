import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useState } from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { UserService } from '../../services/UserService';
import { useNotification } from '../../hooks/useNotification';

export default function BusinessCard({ business, defaultFavorited = false, onUnfavorite }) {
    const { showNotification } = useNotification();

    const { id, name, address, logoUrl, categoryDisplayName } = business;

    const [isFavorited, setIsFavorited] = useState(defaultFavorited);

    const userService = new UserService();

    const toggleFavorite = async () => {
        const estadoAnterior = isFavorited;
        setIsFavorited(!estadoAnterior);

        const result = await userService.toggleFavoriteBusiness(id);

        if (result.success) {
            setIsFavorited(result.data);
            if (!result.data && onUnfavorite) {
                onUnfavorite(id);
            }
            showNotification(result.data ? "Negócio adicionado aos favoritos!" : "Negócio removido dos favoritos.", "success");
        } else {
            setIsFavorited(estadoAnterior);
            showNotification(result.message || "Erro ao atualizar favoritos. Tente novamente.");
        }
    };

    return (
        <div className={styles.cardWrapper}>
            <button 
                className={styles.favoriteBtn} 
                onClick={toggleFavorite}
            >
                {isFavorited ? (
                    <HeartFill className={styles.heartFilled} size={22} />
                ) : (
                    <Heart className={styles.heartOutline} size={22} />
                )}
            </button>
            <Link 
                to={`/business/${id}`} 
                className={`card-common ${styles.businessCard}`}
            >
                <img src={logoUrl} alt={`Logo ${name}`} className={styles.businessLogo} />
                
                <div className={styles.cardInfo}>
                    <h2>{name}</h2>
                    <p>{address}</p>
                    <span className="category-tag">{categoryDisplayName}</span>
                </div>
            </Link>
        </div>
    );
}