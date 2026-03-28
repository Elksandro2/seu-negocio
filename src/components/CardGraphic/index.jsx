import styles from './styles.module.css';

export default function CardGraphic({ value, description, icon, color }) {
    return (
        <div className={styles.metricCard}>
            <div className={styles.iconWrapper} style={{ color: color }}>
                {icon}
            </div>
            <div className={styles.metricInfo}>
                <p className={styles.metricLabel}>{description}</p>
                <h3 className={styles.metricValue}>
                    {value}
                </h3>
            </div>
        </div>
    );
}