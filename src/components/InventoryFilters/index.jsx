import styles from './styles.module.css';

export default function InventoryFilters({ onFilterChange, onSearchChange }) {
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
                <button onClick={() => onFilterChange('all')} className={styles.btnAll}>Todos</button>
                <button onClick={() => onFilterChange('inStock')} className={styles.btnStock}>Em Estoque</button>
                <button onClick={() => onFilterChange('lowStock')} className={styles.btnLowStock}>Estoque Baixo</button>
            </div>
        </div>
    );
}