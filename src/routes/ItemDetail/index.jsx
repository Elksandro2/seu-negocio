import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ItemService } from '../../services/ItemService';
import { ArrowLeft, StarFill, Star as StarEmpty } from 'react-bootstrap-icons';
import Loading from '../../components/Loading';
import styles from './styles.module.css';
import { Carousel } from 'react-bootstrap';
import ReviewCard from '../../components/ReviewCard';
import { ReviewService } from '../../services/ReviewService';

export default function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [item, setItem] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const itemService = new ItemService();
    const reviewService = new ReviewService();
    
    useEffect(() => {
        const fetchItemDetails = async () => {
            setIsLoading(true);
            const response = await itemService.getItemById(id);

            if (response.success) {
                setItem(response.data);
            } else {
                console.error("Erro ao carregar detalhes do item:", response.message);
            }

            const reviewsResponse = await reviewService.getReviewsByItem(id);
            if (reviewsResponse.success) {
                setReviews(reviewsResponse.data);
            }

            setIsLoading(false);
        };

        fetchItemDetails();
    }, [id]);

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((soma, review) => soma + review.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const renderAverageStars = (rating) => {
        const stars = [];
        const roundedRating = Math.round(rating);
        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars.push(<StarFill key={i} className={styles.starFilled} />);
            } else {
                stars.push(<StarEmpty key={i} className={styles.starEmpty} />);
            }
        }
        return stars;
    };

    if (isLoading) return <Loading />;

    if (!item) {
        return (
            <div className={styles.errorContainer}>
                <h2>Ops! Produto não encontrado.</h2>
                <button onClick={() => navigate(-1)} className={styles.backButton}>Voltar</button>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                <ArrowLeft /> Voltar
            </button>

            <div className={styles.detailCard}>
                <div className={styles.imageSection}>
                    {item.imageUrls && item.imageUrls.length > 1 ? (
                        <Carousel interval={null} indicators={true} className={styles.carouselContainer}>
                            {item.imageUrls.map((url, idx) => (
                                <Carousel.Item key={idx}>
                                    <img
                                        src={url}
                                        alt={`${item.name} - Imagem ${idx + 1}`}
                                        className={styles.image}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <img
                            src={item.imageUrls?.[0] || '/placeholder.webp'}
                            alt={item.name}
                            className={styles.image}
                        />
                    )}
                </div>

                <div className={styles.infoSection}>
                    <span className={styles.businessName}>{item.business?.name}</span>
                    <h2 className={styles.title}>{item.name}</h2>
                    
                    <div className={styles.descriptionBox}>
                        <p>{item.description}</p>
                    </div>

                    <p className={styles.price}>
                        R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            <div className={styles.reviewsSection}>
                <div className={styles.reviewsHeader}>
                    <h3 className={styles.reviewsTitle}>Avaliações dos Clientes</h3>
                    
                    {reviews.length > 0 && (
                        <div className={styles.averageContainer}>
                            <div className={styles.stars}>
                                {renderAverageStars(averageRating)}
                            </div>
                            <span className={styles.averageText}>({averageRating} de 5)</span>
                        </div>
                    )}
                </div>
                {reviews.length > 0 ? (
                    <div className={styles.cardsReview}>
                        {reviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                ) : (
                    <p>
                        Este produto ainda não possui avaliações.
                    </p>
                )}
            </div>
        </div>
    );
}