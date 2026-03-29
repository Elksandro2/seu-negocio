import styles from './styles.module.css';

export default function InventoryFilters({ onFilterChange, onSearchChange, filterStatus }) {
    return (
        <div className={styles.container}>
            <div className={styles.searchGroup}>
                <label>NOME DO PRODUTO</label>
                <input 
                    type="text" 
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar produto..."
                />
            </div>

            <div className={styles.buttonGroup}>
                <button onClick={() => onFilterChange('all')} className={`${styles.btnAll} ${filterStatus === 'all' ? styles.active : ''}`}>Todos</button>
                <button onClick={() => onFilterChange('inStock')} className={`${styles.btnStock} ${filterStatus === 'inStock' ? styles.active : ''}`}>Em Estoque</button>
                <button onClick={() => onFilterChange('lowStock')} className={`${styles.btnLowStock} ${filterStatus === 'lowStock' ? styles.active : ''}`}>Estoque Baixo</button>
                <button onClick={() => onFilterChange('outOfStock')} className={`${styles.btnOutOfStock} ${filterStatus === 'outOfStock' ? styles.active : ''}`}>Esgotados</button>
            </div>
        </div>
    );
}