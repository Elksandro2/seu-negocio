import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserService } from '../../../services/UserService';
import { AuthContext } from '../../../contexts/AuthContext';
import Loading from '../../../components/Loading';
import styles from './styles.module.css';
import defaultProfilePicture from '../../../assets/user.png';
import MinhaConta from '../../../components/MinhaConta';
import { AdminService } from '../../../services/AdminService';
import { useNotification } from '../../../hooks/useNotification';

export default function Profile() {
    const { showNotification } = useNotification();
    const { user, logout } = useContext(AuthContext);
    const { id: urlUserId } = useParams();
    
    const isAdminView = !!urlUserId;
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const userService = new UserService();
    const adminService = new AdminService();

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);

            if (isAdminView) {
                const result = await adminService.getAllUsers();
                if (result.success) {
                    const foundUser = result.data.find(u => u.id === Number(urlUserId));
                    if (foundUser) {
                        setUserData(foundUser);
                    } else {
                        showNotification("Usuário não encontrado.");
                    }
                } else {
                    showNotification(result.message || "Erro ao buscar dados do usuário.");
                }
            } else {
                if (!user?.id) return;
                const result = await userService.getUserData();
                if (result.success) {
                    setUserData(result.data);
                } else {
                    showNotification(result.message || "Falha ao carregar seu perfil.");
                }
            }
            
            setIsLoading(false);
        };

        fetchUserData();
    }, [user?.id, urlUserId, isAdminView]);


    const handleDeleteUser = async () => {
        if (!window.confirm("ATENÇÃO: Você tem certeza que deseja remover sua conta? Esta ação é irreversível.")) {
            return;
        }

        setIsSubmitting(true);

        if (isAdminView) {
            const deleteResult = await adminService.deleteUser(urlUserId);
            if (deleteResult.success) {
                showNotification("Usuário removido com sucesso. Redirecionando...", "success");
                navigate('/admin/businesses');
            } else {
                showNotification(deleteResult.message || "Falha ao remover usuário.");
                setIsSubmitting(false);
            }
        } else {
            const deleteResult = await userService.deleteUser(user.id);
            if (deleteResult.success) {
                showNotification("Conta removida com sucesso. Redirecionando...", "success");
                logout();
            } else {
                showNotification(deleteResult.message || "Falha ao remover sua conta.");
                setIsSubmitting(false);
            }
        }
    };

    if (isLoading || !userData) {
        return <Loading />;
    }

    return (
        <div>
            {!isAdminView && (
                <div className={styles.profileOptions}>
                    <MinhaConta />
                </div>
            )}
            <div className={styles.profileContainer}>
                <h2 className="category-title">
                    {isAdminView ? 'Perfil do Usuário' : 'Meu Perfil'}
                </h2>

                <div className={styles.profileCard}>
                    <div className={styles.infoGroup}>
                        {userData.profilePictureUrl ? (
                            <img src={userData.profilePictureUrl} alt="Foto de perfil" className={styles.image} />
                        ) : (
                            <img src={defaultProfilePicture} alt="Foto de perfil padrão" className={styles.image} />
                        )}
                    </div>
                    <div className={styles.infoGroup}>
                        <p className={styles.label}>Nome:</p>
                        <p className={styles.value}>{userData.name}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <p className={styles.label}>Email:</p>
                        <p className={styles.value}>{userData.email}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <p className={styles.label}>WhatsApp:</p>
                        <p className={styles.value}>{userData.whatsapp || 'Não informado'}</p>
                    </div>
                    <div className={styles.infoGroup}>
                        <p className={styles.label}>Status:</p>
                        <p className={styles.value}>{userData.role === 'SELLER' ? 'Vendedor' : 'Comprador'}</p>
                    </div>
                </div>

                <div className={styles.actionSection}>
                    {!isAdminView && (
                        <button onClick={() => navigate(`/profile/edit`)} className={styles.editButton} disabled={isSubmitting}>
                            Editar Dados
                        </button>
                    )}

                    <button onClick={handleDeleteUser} className={styles.deleteButton} disabled={isSubmitting}>
                        {isSubmitting ? 'Removendo...' : (isAdminView ? 'Excluir Este Usuário' : 'Excluir Minha Conta')}
                    </button>
                </div>
            </div>
        </div>
    );
}