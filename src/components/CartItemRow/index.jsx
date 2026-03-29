import { BsTrash } from 'react-icons/bs';
import styles from './styles.module.css';
import QuantityControl from '../QuantityControl';

export default function CartItemRow({ cartItem, onUpdateQuantity, onRemove }) {

    const { item, subtotal } = cartItem;
    const isProduct = item.offerType === 'PRODUCT';

    return (
        <div className={styles.itemRow}>
            <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />

            <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.businessName}>Loja: {item.businessName}</p>
                <p className={styles.price}>R$ {item.price.toFixed(2)} {isProduct ? '/ un.' : ''}</p>
            </div>

            {isProduct && (
                <div className='me-3'>
                    <QuantityControl
                        initialQuantity={cartItem.quantity}
                        minQuantity={1}
                        onQuantityChange={(newQty) => onUpdateQuantity(item.id, newQty)}
                    />
                </div>
            )}

            <span className={styles.itemSubtotal}>R$ {subtotal.toFixed(2)}</span>

            <button onClick={() => onRemove(item.id)} className={styles.removeButton}>
                <BsTrash size={20} />
            </button>
        </div>
    );
}