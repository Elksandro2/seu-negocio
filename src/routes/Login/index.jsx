import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../services/UserService';
import { AuthContext } from '../../contexts/AuthContext';
import styles from './styles.module.css';
import InputField from '../../components/InputField';
import PasswordField from '../../components/PasswordField';
import { useNotification } from '../../hooks/useNotification';

export default function Login() {
    const { showNotification } = useNotification();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const userService = new UserService();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const loginResult = await userService.login(email, password);

        if (!loginResult.success) {
            showNotification(loginResult.message || "Falha ao autenticar.");
            setIsLoading(false);
            return;
        }

        const { token, expiresIn } = loginResult.data;

        login(token, expiresIn, null);

        const userResult = await userService.getUserData();

        if (!userResult.success) {
            showNotification("Login realizado, mas falha ao buscar perfil.");
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
                <h1>Seu Negócio</h1>
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
                    className={`submit-button ${styles.loginSubmitButton}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Aguarde...' : 'Entrar'}
                </button>
            </form>

            <p className={styles.registerLink}>
                Novo por aqui? <span onClick={() => navigate('/register')} className={styles.linkText}>Crie sua conta</span>
            </p>
        </div>
    );
}