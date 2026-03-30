import { useState} from 'react';
import styles from "./styles.module.css";

export default function QuantityControl({ initialQuantity, onQuantityChange, minQuantity = 0 }) {
    const [quantity, setQuantity] = useState(initialQuantity);

    const handleDecrement = () => {
        if (quantity > minQuantity) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange(newQuantity);
        }
    };

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange(newQuantity);
    };

    const handleBlur = () => {
        let safeQuantity = parseInt(quantity);
        
        if (isNaN(safeQuantity) || safeQuantity < minQuantity) {
            safeQuantity = minQuantity;
        }
        
        setQuantity(safeQuantity);
        
        if (safeQuantity !== initialQuantity) {
            onQuantityChange(safeQuantity);
        }
    };

    return (
        <div className={styles.inputGroup}>
            <button 
                onClick={handleDecrement} 
                disabled={quantity <= minQuantity} 
                className={styles.qtyButton}
            >
                -
            </button>
            <input
                type="number"
                min={minQuantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onBlur={handleBlur}
                className={styles.qtyInput}
            />
            <button 
                onClick={handleIncrement}  
                className={styles.qtyButton}
            >
                +
            </button>
        </div>
    );
}