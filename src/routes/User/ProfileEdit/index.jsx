import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../../services/UserService';
import { AuthContext } from '../../../contexts/AuthContext';
import InputField from '../../../components/InputField';
import MessagePopUp from '../../../components/MessagePopUp';

export default function ProfileEdit() {
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);
    const userService = new UserService();

    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('error');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setWhatsapp(user.whatsapp || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const updateData = { name, whatsapp };

        const updateResult = await userService.updateUser(user.id, updateData);

        if (updateResult.success) {
            setPopUpMessage("Perfil atualizado com sucesso!");
            setSeverity('success');
            setShowMessagePopUp(true);

            const updatedUserResult = await userService.getUserData();
            if (updatedUserResult.success) {
                const token = localStorage.getItem('token');
                const expirationTime = localStorage.getItem('tokenExpiration');

                login(token, expirationTime, updatedUserResult.data);
            }
            navigate('/profile');
        } else {
            setPopUpMessage(updateResult.message || "Falha ao atualizar perfil.");
            setSeverity('error');
            setShowMessagePopUp(true);
        }
        setIsLoading(false);
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form-card">
                <h2>Editar Perfil</h2>

                <InputField label="Nome Completo" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />

                <InputField label="WhatsApp" id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} disabled={isLoading} />

                <div className="button-container">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ?
                            'Salvando...' :
                            'Salvar Alterações'
                        }
                    </button>
                    <button type="button" className="cancel-button" onClick={() => navigate(-1)} disabled={isLoading}>
                        Cancelar
                    </button>
                </div>
            </form>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}