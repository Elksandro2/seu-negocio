import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ItemService } from '../../services/ItemService';
import { ArrowLeft } from 'react-bootstrap-icons';
import Loading from '../../components/Loading';
import styles from './styles.module.css';
import { Carousel } from 'react-bootstrap';

export default function ItemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const itemService = new ItemService();
    
    useEffect(() => {
        const fetchItemDetails = async () => {
            setIsLoading(true);
            const response = await itemService.getItemById(id);

            if (response.success) {
                setItem(response.data);
            } else {
                console.error("Erro ao carregar detalhes do item:", response.message);
            }
            setIsLoading(false);
        };

        fetchItemDetails();
    }, [id]);

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
                <h3 className={styles.reviewsTitle}>Avaliações dos Clientes</h3>
            </div>
        </div>
    );
}