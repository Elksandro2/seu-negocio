import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartService } from '../../services/CartService';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import MessagePopUp from '../../components/MessagePopUp';
import styles from './styles.module.css';

import CartItemRow from '../../components/CartItemRow'; 

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    
    const navigate = useNavigate();
    const cartService = new CartService();
    const { user } = useContext(AuthContext); 
    
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
                    
                    <button className={styles.checkoutButton}>
                        Finalizar Pedido (R$ {total.toFixed(2)})
                    </button>
                </div>
            </div>
            
            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}