import { useState, useEffect } from 'react';
import { OrderService } from '../../services/OrderService';
import MinhaConta from '../../components/MinhaConta';
import ReviewModal from '../../components/ReviewModal';
import Loading from '../../components/Loading';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';

const orderService = new OrderService();

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [itemToReview, setItemToReview] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            const response = await orderService.getCustomerOrders();

            if (response.success && response.data) {
                const flattenedItems = response.data.flatMap(order => 
                    order.items.map(item => ({
                        ...item,
                        orderId: order.id,
                        businessName: order.businessName,
                        orderDate: order.createdAt,
                        statusDescription: order.statusDescription,
                        offerType: item.offerType
                    }))
                );
                setPurchases(flattenedItems);
            } else {
                console.error("Erro ao buscar histórico:", response.message);
            }
            setLoading(false);
        };

        fetchHistory();
    }, []);

    const handleOpenReview = (itemId) => {
        setItemToReview(itemId);
        setIsReviewModalOpen(true);
    };

    if (loading) return <Loading />;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.sidebar}>
                <MinhaConta />
            </div>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Histórico de Compras</h1>
                    <p className={styles.subtitle}>Acompanhe seus pedidos e serviços solicitados.</p>
                </div>

                <div className={styles.listContainer}>
                    {purchases.length > 0 ? (
                        purchases.map((purchase, index) => (
                            <div key={`${purchase.orderId}-${purchase.itemId}-${index}`} className={styles.card}>
                                
                                <div className={styles.cardLeft}>
                                    <div className={styles.imageWrapper}>
                                        <img 
                                            src={purchase.itemImageUrl || '/placeholder.webp'} 
                                            alt={purchase.itemName} 
                                            className={styles.image} 
                                        />
                                        <span className={`${styles.typeBadge} ${purchase.offerType === 'PRODUCT' ? styles.badgeProduct : styles.badgeService}`}>
                                            {purchase.offerType === 'PRODUCT' ? 'P' : 'S'}
                                        </span>
                                    </div>

                                    <div className={styles.info}>
                                        <h3 className={styles.itemName}>{purchase.itemName}</h3>
                                        <p className={styles.businessName}>Loja: <strong>{purchase.businessName}</strong></p>
                                        <p className={styles.orderDate}>
                                            Data do pedido: {new Date(purchase.orderDate).toLocaleDateString('pt-BR')}
                                        </p>
                                        <div className={styles.priceRow}>
                                            <span className={styles.quantity}>{purchase.quantity}x</span>
                                            <span className={styles.price}>
                                                R$ {purchase.unitPrice?.toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <span className={styles.statusLabel}>{purchase.statusDescription}</span>
                                    
                                    <button 
                                        onClick={() => handleOpenReview(purchase.itemId)} 
                                        className={styles.btnReview}
                                    >
                                        Avaliar
                                    </button>
                                    
                                    <button className={styles.btnDetails}>
                                        Ver Detalhes
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Você ainda não possui nenhum histórico de compras ou agendamentos.</p>
                            <Link to="/" className={styles.btnHome}>Explorar o Marketplace</Link>
                        </div>
                    )}
                </div>
            </div>

            {isReviewModalOpen && (
                <ReviewModal
                    show={isReviewModalOpen} 
                    onClose={() => setIsReviewModalOpen(false)} 
                    itemId={itemToReview} 
                />
            )}
        </div>
    );
}