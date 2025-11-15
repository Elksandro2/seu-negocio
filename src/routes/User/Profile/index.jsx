import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../../services/UserService';
import { AuthContext } from '../../../contexts/AuthContext';
import MessagePopUp from '../../../components/MessagePopUp';
import Loading from '../../../components/Loading';
import styles from './styles.module.css';
// importar foto padrão do assets se necessário
import defaultProfilePicture from '../../../assets/user.png';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('info');

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const userService = new UserService();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) return;

            const result = await userService.getUserData();

            if (result.success) {
                setUserData(result.data);
            } else {
                setPopUpMessage(result.message || "Falha ao carregar seu perfil.");
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, [user?.id]);


    const handleDeleteUser = async () => {
        if (!window.confirm("ATENÇÃO: Você tem certeza que deseja remover sua conta? Esta ação é irreversível.")) {
            return;
        }

        setIsSubmitting(true);
        const deleteResult = await userService.deleteUser(user.id);

        if (deleteResult.success) {
            setPopUpMessage("Conta removida com sucesso. Redirecionando...");
            setSeverity('success');
            setShowMessagePopUp(true);

            logout();
        } else {
            setPopUpMessage(deleteResult.message || "Falha ao remover sua conta.");
            setSeverity('error');
            setShowMessagePopUp(true);
            setIsSubmitting(false);
        }
    };

    if (isLoading || !userData) {
        return <Loading />;
    }

    return (
        <div className={styles.profileContainer}>
            <h2 className="category-title">Meu Perfil</h2>

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
                <button onClick={() => navigate(`/profile/edit`)} className={styles.editButton} disabled={isSubmitting}>
                    Editar Dados
                </button>

                <button onClick={handleDeleteUser} className={styles.deleteButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Removendo...' : 'Excluir Conta'}
                </button>
            </div>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}