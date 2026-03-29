import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminService } from '../../services/AdminService';
import { Trash, Eye } from 'react-bootstrap-icons';
import Loading from '../../components/Loading';
import styles from './styles.module.css';
import { useNotification } from '../../hooks/useNotification';

export default function AdminBusinesses() {
    const { showNotification } = useNotification();

    const [businesses, setBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const adminService = new AdminService();

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        setIsLoading(true);
        const response = await adminService.getAllBusinesses();

        if (response.success) {
            setBusinesses(response.data);
        } else {
            showNotification("Erro ao carregar a lista de lojas.");
        }
        setIsLoading(false);
    };

    const handleDelete = async (businessId, businessName) => {
        const confirmDelete = window.confirm(`Tem certeza que deseja excluir a loja "${businessName}"? Esta ação não pode ser desfeita.`);
        
        if (!confirmDelete) return;

        const response = await adminService.deleteBusiness(businessId);

        if (response.success) {
            showNotification("Loja excluída com sucesso!", "success");
            setBusinesses(businesses.filter(b => b.id !== businessId));
        } else {
            showNotification("Erro ao excluir a loja. Tente novamente mais tarde.");
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Administração de Lojas</h2>
                <p className={styles.subtitle}>Gerencie todas as lojas cadastradas no sistema.</p>
            </div>

            <div className={styles.tableContainer}>
                {businesses.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Nome da Loja</th>
                                <th>Dono</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {businesses.map((business) => (
                                <tr key={business.id}>
                                    <td className={styles.logoCell}>
                                        <img 
                                            src={business.logoUrl || '/placeholder.webp'} 
                                            alt={business.name} 
                                            className={styles.logo} 
                                        />
                                    </td>
                                    <td className={styles.businessName}>{business.name}</td>
                                    <td>
                                        <Link to={`/admin/user/${business.owner?.id}`} className={styles.ownerLink}>
                                            {business.owner?.name}
                                        </Link>
                                    </td>
                                    <td>
                                        <div className={styles.actionsWrapper}>
                                            <button 
                                                className={styles.btnView}
                                                onClick={() => navigate(`/business/${business.id}`)}
                                            >
                                                <Eye size={18} /> Ver Loja
                                            </button>
                                            <button 
                                                className={styles.btnDelete}
                                                onClick={() => handleDelete(business.id, business.name)}
                                            >
                                                <Trash size={18} /> Excluir
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.emptyState}>
                        <p>Nenhuma loja cadastrada no sistema até o momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}