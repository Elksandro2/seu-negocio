import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartService } from '../../services/CartService';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import MessagePopUp from '../../components/MessagePopUp';
import styles from './styles.module.css';

import CartItemRow from '../../components/CartItemRow';
import { Pix } from '@mui/icons-material';
import { BiCopy } from 'react-icons/bi';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    const [showQrCode, setShowQrCode] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const navigate = useNavigate();
    const cartService = new CartService();
    const { user } = useContext(AuthContext);

    const pixKey = "d39be51e-5ab8-425c-b68d-cdb0dc30827c";

    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    const fetchCart = async () => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        const result = await cartService.getMyCart();

        if (result.success) {
            setCartItems(result.data);
        } else {
            setPopUpMessage(result.message || "Falha ao carregar seu carrinho.");
            setShowMessagePopUp(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCart();
    }, [user?.id]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            await handleRemoveItem(itemId);
            return;
        }

        const result = await cartService.updateItemQuantity(itemId, newQuantity);

        if (result.success) {
            setCartItems(result.data);
        } else {
            setPopUpMessage("Falha ao atualizar quantidade.");
            setShowMessagePopUp(true);
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm("Remover item do carrinho?")) {
            return;
        }

        const result = await cartService.removeItem(itemId);

        if (result.success) {
            setPopUpMessage("Item removido.");
            setSeverity('success');
            setShowMessagePopUp(true);
            fetchCart();
        } else {
            setPopUpMessage(result.message || "Falha ao remover item.");
            setShowMessagePopUp(true);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(pixKey);
            
            setCopySuccess(true);
            setPopUpMessage('Chave Pix copiada para a área de transferência!');
            setSeverity('success');
            setShowMessagePopUp(true); 
        } catch (err) {
            setPopUpMessage('Falha ao copiar a chave Pix.');
            setSeverity('error');
            setShowMessagePopUp(true);
            setCopySuccess(false);
        }
        
        setTimeout(() => setCopySuccess(false), 2000); 
    };


    if (isLoading) {
        return <Loading />;
    }

    if (cartItems.length === 0) {
        return (
            <div className="no-data-container">
                <h1>Seu Carrinho está Vazio</h1>
                <p className="no-data">Explore o marketplace para adicionar produtos ou serviços.</p>
                <button onClick={() => navigate('/')} className="submit-button">
                    Ir para o Marketplace
                </button>
            </div>
        );
    }

    return (
        <div className={styles.cartContainer}>
            <h2 className="category-title">Seu Carrinho de Compras</h2>

            <div className={styles.cartGrid}>
                <div className={styles.itemsList}>
                    {cartItems.map(item => (
                        <CartItemRow
                            key={item.id}
                            cartItem={item}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemove={handleRemoveItem}
                        />
                    ))}
                </div>

                <div className={styles.cartSummary}>
                    <h2>Resumo</h2>
                    <div className={styles.summaryItem}>
                        <span>Subtotal ({cartItems.length} itens):</span>
                        <span>R$ {total.toFixed(2)}</span>
                    </div>
                    <p className={styles.shippingNote}>Não perca tempo e garanta já o seu pedido!</p>
                    <p className={styles.textPix}><Pix className={styles.pix} fontSize='medium' />Pagamento via Pix</p>

                    <button className={styles.checkoutButton} onClick={() => setShowQrCode(true)}>
                        Finalizar Pedido (R$ {total.toFixed(2)})
                    </button>

                    {showQrCode && (
                        <div className={styles.qrCode}>
                            <img src="qrcode.png" alt="QRCode" />
                            <div className={styles.keyBox}>
                                <span className={styles.keyText}>{pixKey}</span>
                                <button
                                    onClick={handleCopy}
                                    className={styles.copyButton}
                                >
                                    {copySuccess ? 'Copiado!' : <BiCopy size={18} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}