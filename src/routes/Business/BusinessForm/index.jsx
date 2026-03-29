import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BusinessService } from '../../../services/BusinessService';
import InputField from '../../../components/InputField';
import Loading from '../../../components/Loading';
import ImageUploadField from '../../../components/ImageUploadField';
import TextAreaField from '../../../components/TextAreaField';
import SelectField from '../../../components/SelectField';
import { UserService } from '../../../services/UserService';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNotification } from '../../../hooks/useNotification';

export default function BusinessForm() {
    const { login } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const { businessId } = useParams();
    const isEditMode = !!businessId;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [existingLogoUrl, setExistingLogoUrl] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const businessService = new BusinessService();
    const userService = new UserService();

    useEffect(() => {
        const fetchInitialData = async () => {
            const categoriesResult = await businessService.getAllCategories();

            if (!categoriesResult.success) {
                showNotification(categoriesResult.message || "Falha ao carregar opções de categoria.", "danger")
                setIsLoading(false);
                return;
            }
            setCategoriesList(categoriesResult.data);

            if (isEditMode) {
                const detailResult = await businessService.getBusinessById(businessId);

                if (!detailResult.success) {
                    showNotification(detailResult.message || "Negócio não encontrado para edição.", "danger")
                    navigate('/my-businesses');
                    return;
                }

                const data = detailResult.data;
                setName(data.name);
                setDescription(data.description);
                setAddress(data.address);
                setCategoryType(data.categoryType);
                setExistingLogoUrl(data.logoUrl);
            }

            setIsLoading(false);
        };

        fetchInitialData();
    }, [businessId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const businessData = {
            name,
            description,
            address,
            categoryType,
        };

        let submitResult;

        if (isEditMode) {
            submitResult = await businessService.updateBusiness(businessId, businessData);
        } else {
            if (!logoFile) {
                showNotification("A imagem da logo é obrigatória.", "danger")
                setIsSubmitting(false);
                return;
            }
            submitResult = await businessService.createBusiness(businessData, logoFile);

            const updatedUserResult = await userService.getUserData();
            if (updatedUserResult.success) {
                const token = localStorage.getItem('token');
                const expirationTime = localStorage.getItem('tokenExpiration');

                login(token, expirationTime, updatedUserResult.data);
            }
        }

        if (!submitResult.success) {
            showNotification(submitResult.message || "Falha ao salvar o negócio.", "danger")
            setIsSubmitting(false);
            return;
        }

        showNotification(`Negócio ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`, "success")
        navigate('/my-businesses');
        setIsSubmitting(false);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>{isEditMode ? 'Editar Negócio' : 'Cadastrar Novo Negócio'}</h2>

                {isEditMode ? (
                    <img src={existingLogoUrl} alt={name} className="image-original" />
                ) : (
                    <ImageUploadField
                        imageFile={logoFile}
                        setImageFile={setLogoFile}
                        label="Foto da Logo"
                        isSubmitting={isSubmitting}
                        isCircular={true}
                        required={true}
                    />
                )}

                <InputField
                    label="Nome do Negócio"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSubmitting}
                />

                <TextAreaField
                    label="Descrição Completa"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={4}
                />

                <InputField
                    label="Endereço"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    disabled={isSubmitting}
                />

                <SelectField
                    label="Categoria"
                    id="category"
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    options={categoriesList.map(c => ({ key: c.key, displayName: c.displayName }))}
                    required
                    disabled={isSubmitting}
                />

                <div className="button-container">
                    <button type="submit" className="submit-button" disabled={isSubmitting || (!isEditMode && logoFile === null)}>
                        {isSubmitting ?
                            'Salvando...' :
                            (isEditMode ?
                                'Salvar Alterações'
                                : 'Cadastrar Negócio'
                            )}
                    </button>
                    {isEditMode &&
                        <button type="button" className="cancel-button" onClick={() => navigate(-1)} disabled={isSubmitting}>
                            Cancelar
                        </button>
                    }
                </div>
            </form>
        </div>
    );
}