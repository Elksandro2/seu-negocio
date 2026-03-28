 import styles from './styles.module.css';

export default function TopProductsList({ products }) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Mais Vendidos</h3>
            
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Loja</th>
                            <th>Qtd. Vendida</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className={styles.productCell}>
                                        <img 
                                            src={product.imageUrl || '/placeholder.webp'} 
                                            alt={product.name} 
                                            className={styles.productImage} 
                                        />
                                        <span className={styles.productName}>{product.name}</span>
                                    </td>
                                    <td className={styles.businessCell}>{product.businessName}</td>
                                    <td className={styles.quantityCell}>
                                        <span className={styles.badge}>{product.quantitySold} un.</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className={styles.emptyMessage}>
                                    Nenhuma venda registrada com os filtros atuais.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}