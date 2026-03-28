import { StarFill, Star as StarEmpty, PersonCircle } from 'react-bootstrap-icons';
import styles from './styles.module.css';

export default function ReviewCard({ review }) {
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<StarFill key={i} className={styles.starFilled} />);
            } else {
                stars.push(<StarEmpty key={i} className={styles.starEmpty} />);
            }
        }
        return stars;
    };

    const formattedDate = review.createdAt 
        ? new Date(review.createdAt).toLocaleDateString('pt-BR') 
        : '';

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                {review.authorProfilePictureUrl ? (
                    <img src={review.authorProfilePictureUrl} alt="Avatar" className={styles.avatarImage} />
                ) : (
                    <PersonCircle className={styles.avatarIcon} />
                )}
                
                <span className={styles.userName}>{review.authorName}</span>
            </div>
            
            {formattedDate && <span className={styles.date}>- {formattedDate}</span>}
            <div className={styles.stars}>
                {renderStars(review.rating)}
            </div>

            <p className={styles.comment}>
                {review.comment}
            </p>
        </div>
    );
}