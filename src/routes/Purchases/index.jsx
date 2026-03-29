import { useState, useEffect } from 'react';
import { OrderService } from '../../services/OrderService';
import MinhaConta from '../../components/MinhaConta';
import ReviewModal from '../../components/ReviewModal';
import Loading from '../../components/Loading';
import styles from './styles.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { ReviewService } from '../../services/ReviewService';
import MessagePopUp from '../../components/MessagePopUp';

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [itemToReview, setItemToReview] = useState(null);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('danger');

    const reviewService = new ReviewService();
    const orderService = new OrderService();

    const navigate = useNavigate();

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

    const handleOpenReview = (purchase) => {
        setItemToReview(purchase);
        setIsReviewModalOpen(true);
    };

    const handleSaveReview = async (reviewData) => {
        const payload = {
            itemId: itemToReview.itemId,
            rating: reviewData.rating,
            comment: reviewData.comment
        };

        const response = await reviewService.createReview(payload);

        if (response.success) {
            setPopUpMessage("Avaliação enviada com sucesso! Obrigado pelo feedback.");
            setSeverity("success");
            setShowMessagePopUp(true);
            setIsReviewModalOpen(false);
        } else {
            setPopUpMessage(response.message || "Você só pode avaliar itens que já comprou.");
            setSeverity("danger");
            setShowMessagePopUp(true);
        }
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
                                    <button 
                                        onClick={() => handleOpenReview(purchase)}
                                        className={styles.btnReview}
                                    >
                                        Avaliar
                                    </button>
                                    
                                    <button 
                                        onClick={() => navigate(`/item/${purchase.itemId}`)} 
                                        className={styles.btnDetails}
                                    >
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
                    isOpen={isReviewModalOpen} 
                    onClose={() => setIsReviewModalOpen(false)} 
                    onSave={handleSaveReview}  
                    item={itemToReview} 
                />
            )}
            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}