import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services/UserService';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './styles.module.css';
import MessagePopUp from '../../components/MessagePopUp';
import InputField from '../../components/InputField';
import PasswordField from '../../components/PasswordField';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [severity, setSeverity] = useState('error');

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const userService = new UserService();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const loginResult = await userService.login(email, password);

        if (!loginResult.success) {
            setPopUpMessage(loginResult.message || "Falha ao autenticar.");
            setSeverity('error');
            setShowMessagePopUp(true);
            setIsLoading(false);
            return;
        }

        const { token, expiresIn } = loginResult.data;

        login(token, expiresIn, null);

        const userResult = await userService.getUserData();

        if (!userResult.success) {
            setPopUpMessage("Login realizado, mas falha ao buscar perfil.");
            setSeverity('error');
            setShowMessagePopUp(true);
            setIsLoading(false);
            return;
        }

        login(token, expiresIn, userResult.data);
        navigate('/');
        setIsLoading(false);
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <h2>Entrar</h2>

                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <PasswordField
                    label="Senha"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    className={`submitButton ${styles.loginSubmitButton}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Aguarde...' : 'Entrar'}
                </button>
            </form>

            <p className={styles.registerLink}>
                Novo por aqui? <span onClick={() => navigate('/register')} className={styles.linkText}>Crie sua conta</span>
            </p>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}