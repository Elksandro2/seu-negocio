import styles from './styles.module.css';

export default function DashboardFilters({ 
    businesses, 
    selectedBusiness, 
    setSelectedBusiness, 
    dateRange, 
    setDateRange 
}) {
    return (
        <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
                <label className={styles.label}>Filtrar por Loja:</label>
                <select 
                    className={styles.select} 
                    value={selectedBusiness} 
                    onChange={(e) => setSelectedBusiness(e.target.value)}
                >
                    <option value="all">Todas as Minhas Lojas</option>
                    {businesses.map((businessName, index) => (
                        <option key={index} value={businessName}>{businessName}</option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <label className={styles.label}>Período:</label>
                <div className={styles.buttonGroup}>
                    <button 
                        className={dateRange === 'all' ? styles.btnActive : styles.btnInactive}
                        onClick={() => setDateRange('all')}
                    >
                        Todo o período
                    </button>
                    <button 
                        className={dateRange === '30' ? styles.btnActive : styles.btnInactive}
                        onClick={() => setDateRange('30')}
                    >
                        Últimos 30 dias
                    </button>
                    <button 
                        className={dateRange === '7' ? styles.btnActive : styles.btnInactive}
                        onClick={() => setDateRange('7')}
                    >
                        Últimos 7 dias
                    </button>
                </div>
            </div>

        </div>
    );
}