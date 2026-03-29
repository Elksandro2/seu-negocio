import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './styles.module.css';
import { BsWhatsapp, BsCartPlus } from 'react-icons/bs';
import MessagePopUp from '../MessagePopUp';
import { CartService } from '../../services/CartService';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Scheduler from '../Scheduler';

export default function ItemCard({ item }) {
    const { isLoggedIn } = useContext(AuthContext);
    const cartService = new CartService();

    const navigate = useNavigate();

    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

    const { id, name, description, price, offerType, imageUrls } = item;

    const images = imageUrls?.length > 0 ? imageUrls : ['/placeholder.png'];

    const isProduct = offerType === 'PRODUCT';

    const handleActionClick = async () => {
        if (!isLoggedIn) {
            setPopUpMessage('Você precisa estar logado para realizar esta ação.');
            setSeverity('warning');
            setShowMessagePopUp(true);
            return;
        }

        if (isProduct) {
            const result = await cartService.addItemToCart(id, 1);
            if (result.success) {
                setPopUpMessage(`"${name}" adicionado ao carrinho!`);
                setSeverity('success');
            } else {
                setPopUpMessage(result.message || "Falha ao adicionar item ao carrinho.");
                setSeverity('danger');
            }
            setShowMessagePopUp(true);
        } else {
            setIsSchedulerOpen(true);
        }
    };

    const handleScheduleConfirm = async (scheduledDateTime) => {
        setIsSchedulerOpen(false);
        
        const result = await cartService.addItemToCart(id, 1, scheduledDateTime);
        if (result.success) {
            setPopUpMessage(`"${name}" adicionado ao carrinho!`);
            setSeverity('success');
        } else {
            setPopUpMessage(result.message || "Falha ao adicionar item ao carrinho.");
            setSeverity('danger');
        }
    };

    const handleViewDetails = () => {
        navigate(`/item/${item.id}`);
    };

    return (
        <div className={styles.cardContainer}>
            {images.length > 1 ? (
                <Carousel interval={null} indicators={true}>
                    {images.map((url, idx) => (
                        <Carousel.Item key={idx}>
                            <img
                                src={url}
                                alt={`${name} - Imagem ${idx + 1}`}
                                className={styles.itemImage}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <img
                    src={images[0]}
                    alt={name}
                    className={styles.itemImage}
                />
            )}

            <div className={styles.cardBody}>
                <h3 className={styles.itemName}>{name}</h3>
                <p className={styles.itemDescription}>{description}</p>

                <div className={styles.priceSection}>
                    {isProduct ? (
                        <span className={styles.price}>R$ {price ? price.toFixed(2) : 'A consultar'}</span>
                    ) : (
                        <span className={styles.price}>
                            {price ? `R$ ${price.toFixed(2)}` : 'Preço a negociar'}
                        </span>
                    )}
                </div>

                <div className={styles.buttonsSection}>
                    <button
                        onClick={handleActionClick}
                        className={`${styles.actionButton} ${isProduct ? styles.buyButton : styles.contactButton}`}
                        disabled={!isLoggedIn}
                    >
                        {isProduct ? (
                            <><BsCartPlus size={18} /> Adicionar</>
                        ) : (
                            <><BsWhatsapp size={18} /> Agendar</>
                        )}
                    </button>

                    <button onClick={handleViewDetails} className={styles.detailsButton}>Ver Detalhes</button>
                </div>

                {!isLoggedIn && (
                    <p className={styles.loginRequired}>Faça login para {isProduct ? 'comprar' : 'contatar'}.</p>
                )}
            </div>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
            <Scheduler
                isOpen={isSchedulerOpen} 
                onClose={() => setIsSchedulerOpen(false)}
                onSchedule={handleScheduleConfirm} 
            />
        </div>
    );
}