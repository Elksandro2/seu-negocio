import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export default function BusinessCard({ business }) {
    const { id, name, address, logoUrl, categoryDisplayName } = business;

    return (
        <div className={styles.cardWrapper}>
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