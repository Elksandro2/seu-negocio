import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './styles.module.css';
import { BsWhatsapp, BsCartPlus } from 'react-icons/bs';
import MessagePopUp from '../MessagePopUp';
import { CartService } from '../../services/CartService';

export default function ItemCard({ item }) {
    const { isLoggedIn } = useContext(AuthContext);
    const cartService = new CartService();

    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const { id, name, description, price, offerType, imageUrl, business } = item;

    const formatWhatsappNumber = (rawNumber) => {
        if (!rawNumber) return '';
        const countryCode = '55';

        let digits = rawNumber.replace(/\D/g, '');

        if (digits.startsWith(countryCode)) {
            digits = digits.slice(countryCode.length);
        }

        return countryCode + digits;
    };

    const rawWhatsapp = business?.ownerWhatsapp || '81982648586';
    const whatsappNumber = formatWhatsappNumber(rawWhatsapp);

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
                setSeverity('error');
            }
            setShowMessagePopUp(true);
        } else {
            const message = encodeURIComponent(`Olá, gostaria de saber mais sobre o "${name}" que vi no Seu Negócio.`);
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(whatsappLink, '_blank');
        }
    };

    return (
        <div className={styles.cardContainer}>
            <img
                src={imageUrl}
                alt={name}
                className={styles.itemImage}
            />

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

                <button
                    onClick={handleActionClick}
                    className={`${styles.actionButton} ${isProduct ? styles.buyButton : styles.contactButton}`}
                    disabled={!isLoggedIn}
                >
                    {isProduct ? (
                        <><BsCartPlus size={18} /> Adicionar</>
                    ) : (
                        <><BsWhatsapp size={18} /> Conversar</>
                    )}
                </button>

                {!isLoggedIn && (
                    <p className={styles.loginRequired}>Faça login para {isProduct ? 'comprar' : 'contatar'}.</p>
                )}
            </div>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}