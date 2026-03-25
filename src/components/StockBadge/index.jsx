import { getStockStatus } from '../../utils/inventoryUtils';
import styles from './style.module.css';

export default function StockBadge({ quantity }) {
    const statusKey = getStockStatus(quantity);
    
    const statusConfig = {
        outOfStock: { text: 'Esgotado', className: styles.outOfStock },
        lowStock: { text: 'Estoque Baixo', className: styles.lowStock },
        inStock: { text: 'Em Estoque', className: styles.inStock }
    };

    const status = statusConfig[statusKey];

    return (
        <span className={`${styles.badge} ${status.className}`}>
            {status.text}
        </span>
    );
}