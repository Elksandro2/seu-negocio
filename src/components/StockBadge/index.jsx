import styles from './styles.module.css';

export default function StockBadge({ quantity }) {
    const LOW_STOCK_LIMIT = 5;

    let status = { text: 'Em Estoque', className: styles.inStock };

    if (quantity <= 0) {
        status = { text: 'Esgotado', className: styles.outOfStock };
    } else if (quantity <= LOW_STOCK_LIMIT) {
        status = { text: 'Estoque Baixo', className: styles.lowStock };
    }

    return (
        <span className={`${styles.badge} ${status.className}`}>
            {status.text}
        </span>
    );
}