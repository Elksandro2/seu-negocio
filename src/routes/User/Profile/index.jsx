import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserService } from '../../../services/UserService';
import { AuthContext } from '../../../contexts/AuthContext';
import MessagePopUp from '../../../components/MessagePopUp';
import Loading from '../../../components/Loading';
import styles from './styles.module.css';
import defaultProfilePicture from '../../../assets/user.png';
import MinhaConta from '../../../components/MinhaConta';
import { AdminService } from '../../../services/AdminService';

export default function Profile() {
    const { id: urlUserId } = useParams();
    const isAdminView = !!urlUserId;
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('info');

    const { user, logout } = useContext(AuthContext);
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
                        setPopUpMessage("Usuário não encontrado.");
                        setShowMessagePopUp(true);
                    }
                } else {
                    setPopUpMessage("Erro ao buscar dados do usuário.");
                    setShowMessagePopUp(true);
                }
            } else {
                if (!user?.id) return;
                const result = await userService.getUserData();
                if (result.success) {
                    setUserData(result.data);
                } else {
                    setPopUpMessage(result.message || "Falha ao carregar seu perfil.");
                    setShowMessagePopUp(true);
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
                setPopUpMessage("Usuário removido com sucesso. Redirecionando...");
                setSeverity('success');
                setShowMessagePopUp(true);
                navigate('/admin/businesses');
            } else {
                setPopUpMessage(deleteResult.message || "Falha ao remover usuário.");
                setSeverity('danger');
                setShowMessagePopUp(true);
                setIsSubmitting(false);
            }
        } else {
            const deleteResult = await userService.deleteUser(user.id);
            if (deleteResult.success) {
                setPopUpMessage("Conta removida com sucesso. Redirecionando...");
                setSeverity('success');
                setShowMessagePopUp(true);
                logout();
            } else {
                setPopUpMessage(deleteResult.message || "Falha ao remover sua conta.");
                setSeverity('danger');
                setShowMessagePopUp(true);
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

                {showMessagePopUp && (
                    <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
                )}
            </div>
        </div>
    );
}