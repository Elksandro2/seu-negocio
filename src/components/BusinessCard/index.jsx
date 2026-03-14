import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useState } from 'react';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { UserService } from '../../services/UserService';
import MessagePopUp from '../MessagePopUp';

export default function BusinessCard({ business, defaultFavorited = false, onUnfavorite }) {
    const { id, name, address, logoUrl, categoryDisplayName } = business;

    const [isFavorited, setIsFavorited] = useState(defaultFavorited);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('danger');

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
            setPopUpMessage(result.data ? "Negócio adicionado aos favoritos!" : "Negócio removido dos favoritos.");
            setSeverity('success');
            setShowMessagePopUp(true);
        } else {
            setIsFavorited(estadoAnterior);
            setPopUpMessage(result.message || "Erro ao atualizar favoritos. Tente novamente.");
            setShowMessagePopUp(true);
            setSeverity('danger');
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
            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}