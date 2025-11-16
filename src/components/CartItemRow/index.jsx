import { useState, useEffect } from 'react';
import { BsTrash } from 'react-icons/bs';
import styles from './styles.module.css';

export default function CartItemRow({ cartItem, onUpdateQuantity, onRemove }) {
    const [quantity, setQuantity] = useState(cartItem.quantity);

    const { item, subtotal } = cartItem;
    const isProduct = item.offerType === 'PRODUCT';

    useEffect(() => {
        setQuantity(cartItem.quantity);
    }, [cartItem.quantity]);

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        setQuantity(newQuantity);
    };

    const handleBlur = () => {
        const safeQuantity = Math.max(1, quantity || 1);

        if (safeQuantity !== cartItem.quantity) {
            onUpdateQuantity(cartItem.item.id, safeQuantity);
        }
    };

    return (
        <div className={styles.itemRow}>
            <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />

            <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.businessName}>Loja: {item.businessName}</p>
                <p className={styles.price}>R$ {item.price.toFixed(2)} / un.</p>
            </div>

            <div className={styles.quantityControl}>
                {isProduct && (
                    <div className={styles.inputGroup}>
                        <button onClick={() => onUpdateQuantity(item.id, quantity - 1)} disabled={quantity <= 1} className={styles.qtyButton}>
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange}
                            onBlur={handleBlur}
                            className={styles.qtyInput}
                        />
                        <button onClick={() => onUpdateQuantity(item.id, quantity + 1)} className={styles.qtyButton}>
                            +
                        </button>
                    </div>
                )}
            </div>

            <span className={styles.itemSubtotal}>R$ {subtotal.toFixed(2)}</span>

            <button onClick={() => onRemove(item.id)} className={styles.removeButton}>
                <BsTrash size={20} />
            </button>
        </div>
    );
}