import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessService } from '../../../services/BusinessService';
import MessagePopUp from '../../../components/MessagePopUp';
import InputField from '../../../components/InputField';
import Loading from '../../../components/Loading';
import styles from '../styles.module.css';
import { BsCamera } from 'react-icons/bs';

export default function BusinessForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [categoriesList, setCategoriesList] = useState([]);

    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [severity, setSeverity] = useState('error');

    const logoInputRef = useRef(null);
    const navigate = useNavigate();
    const businessService = new BusinessService();

    useEffect(() => {
        const fetchCategories = async () => {
            console.log("Carregando categorias...");
            const result = await businessService.getAllCategories();
            console.log("Categorias carregadas:", result);

            if (result.success) {
                setCategoriesList(result.data);
            } else {
                setPopUpMessage("Falha ao carregar opções de categoria.");
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };

        fetchCategories();
    }, []);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
        }
    };

    const triggerFileInput = () => {
        logoInputRef.current.click();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const businessData = {
            name,
            description,
            address,
            categoryType,
        };

        console.log("Dados do negócio a serem enviados:", businessData);

        if (!logoFile) {
            setPopUpMessage("A imagem da logo é obrigatória.");
            setSeverity('error');
            setShowMessagePopUp(true);
            setIsSubmitting(false);
            return;
        }

        const createResult = await businessService.createBusiness(businessData, logoFile);
        console.log("Resultado da criação do negócio:", createResult);

        if (!createResult.success) {
            setPopUpMessage(createResult.message || "Falha ao criar o negócio.");
            setSeverity('error');
            setShowMessagePopUp(true);
            setIsSubmitting(false);
            return;
        }

        setPopUpMessage("Negócio criado com sucesso! Você agora é um Vendedor.");
        setSeverity('success');
        setShowMessagePopUp(true);

        navigate('/my-businesses');
        setIsSubmitting(false);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.businessForm}>
                <h2>Cadastrar Novo Negócio</h2>

                <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                />
                <div className={styles.logoUploadArea}>
                    <div className={styles.imagePlaceholder} onClick={triggerFileInput}>
                        {logoFile ? (
                            <img src={URL.createObjectURL(logoFile)} alt="Logo" className={styles.uploadedImage} />
                        ) : (
                            <BsCamera size={30} color="var(--label-color)" />
                        )}
                    </div>
                    <p className={styles.logoLabel}>Clique para adicionar a Logo (Obrigatório)</p>
                </div>


                <InputField
                    label="Nome do Negócio"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                />

                <label htmlFor="description" className="label">Descrição Completa</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="input-field"
                    rows="4"
                />

                <InputField
                    label="Endereço"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    disabled={isSubmitting}
                />

                <label htmlFor="category" className="label">Categoria</label>
                <select id="category" value={categoryType} onChange={(e) => setCategoryType(e.target.value)} required disabled={isSubmitting} className="input-field">
                    <option value="" disabled>Selecione a Categoria</option>
                    {categoriesList.map(category => (
                        <option key={category.key} value={category.key}>
                            {category.displayName}
                        </option>
                    ))}
                </select>

                <button type="submit" className={`submit-button ${styles.submitButton}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar Negócio'}
                </button>
            </form>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}