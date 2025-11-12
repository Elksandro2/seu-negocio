import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../../services/UserService';
import styles from './styles.module.css';
import MessagePopUp from '../../../components/MessagePopUp'; 
import { BsEye, BsEyeSlash, BsCamera } from 'react-icons/bs';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [severity, setSeverity] = useState('error');
    
    const imageInputRef = useRef(null);
    const navigate = useNavigate();
    const userService = new UserService();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };
    
    const triggerFileInput = () => {
        imageInputRef.current.click();
    }
    
    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userData = { name, email, password, whatsapp };

        try {
            const registerResult = await userService.register(userData, imageFile);
        
            if (!registerResult.success) {
                setPopUpMessage(registerResult.message || "Falha ao registrar usuário.");
                setSeverity('error');
                setShowMessagePopUp(true);
                setIsLoading(false);
                return;
            }

            navigate('/login');
            
        } catch (error) {
            setPopUpMessage("Erro inesperado durante o registro.");
            setSeverity('error');
            setShowMessagePopUp(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <form onSubmit={handleRegister} className={styles.registerForm}>
                <h2>Criar Conta</h2>
                
                <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                />
                <div 
                    className={styles.imagePlaceholder} 
                    onClick={triggerFileInput}
                >
                    {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} alt="Perfil" className={styles.profileImage} />
                    ) : (
                        <>
                            <BsCamera size={30} color="var(--label-color)" />
                            <p>Adicionar Foto</p>
                        </>
                    )}
                </div>

                <label htmlFor="name" className="label">Nome Completo</label>
                <input type="text" id="name" placeholder=" " value={name} onChange={(e) => setName(e.target.value)} required className="inputField" disabled={isLoading}/>
                
                <label htmlFor="email" className="label">Email</label>
                <input type="email" id="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required className="inputField" disabled={isLoading}/>
                
                <label htmlFor="password" className="label">Senha</label>
                <div className="passwordContainer">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="inputField"
                        disabled={isLoading}
                    />
                     <span className="passwordToggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <BsEyeSlash /> : <BsEye />}
                    </span>
                </div>
                
                <label htmlFor="whatsapp" className="label">WhatsApp</label>
                <input type="tel" id="whatsapp" placeholder=" " value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="inputField" disabled={isLoading}/>


                <button type="submit" className={styles.registerSubmitButton} disabled={isLoading}>
                    {isLoading ? 'Aguarde...' : 'Criar Conta'}
                </button>
            </form>
            
            <p className={styles.loginLink}>
                Já tem cadastro? <span onClick={() => navigate('/login')} className={styles.linkText}>Faça Login</span>
            </p>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}