import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './styles.module.css';
import { BsWhatsapp, BsCartPlus } from 'react-icons/bs';
import MessagePopUp from '../MessagePopUp';

export default function ItemCard({ item }) {
    const { isLoggedIn } = useContext(AuthContext);

    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const { name, description, price, offerType, imageUrl, business } = item;

    const whatsappNumber = business?.ownerWhatsapp || '81999999999'; // falta ajustar

    const isProduct = offerType === 'PRODUCT';

    const handleActionClick = () => {
        if (!isLoggedIn) {
            setPopUpMessage('Você precisa estar logado para realizar esta ação.');
            setSeverity('warning');
            setShowMessagePopUp(true);
            return;
        }

        if (isProduct) {
            setPopUpMessage('Produto adicionado ao carrinho.');
            setSeverity('success');
            setShowMessagePopUp(true);
        } else {
            const message = encodeURIComponent(`Olá, gostaria de saber mais sobre o serviço "${name}" que vi no Seu Negócio.`);
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