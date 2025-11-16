import { useState, useEffect, useContext, useRef } from 'react';
import { ItemService } from '../../../services/ItemService';
import { BusinessService } from '../../../services/BusinessService';
import { AuthContext } from '../../../contexts/AuthContext';
import MessagePopUp from '../../../components/MessagePopUp';
import InputField from '../../../components/InputField';
import styles from './styles.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import ImageUploadField from '../../../components/ImageUploadField';
import SelectField from '../../../components/SelectField';
import TextAreaField from '../../../components/TextAreaField';
import WarningIcon from '@mui/icons-material/Warning';

export default function ItemForm() {
    const { itemId } = useParams();
    const isEditMode = !!itemId;
    const [itemOriginalData, setItemOriginalData] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [offerType, setOfferType] = useState('PRODUCT');
    const [imageFile, setImageFile] = useState(null);
    const [businessesList, setBusinessesList] = useState([]);
    const [selectedBusinessId, setSelectedBusinessId] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('error');

    const navigate = useNavigate();
    const itemService = new ItemService();
    const businessService = new BusinessService();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            const businessResult = await businessService.getMyBusinesses();

            if (businessResult.success) {
                setBusinessesList(businessResult.data);
                if (!isEditMode && businessResult.data.length === 1) {
                    setSelectedBusinessId(businessResult.data[0].id);
                }
            }

            if (isEditMode) {
                const itemResult = await itemService.getItemById(itemId);

                if (itemResult.success) {
                    const item = itemResult.data;
                    setItemOriginalData(item);
                    setName(item.name);
                    setDescription(item.description);
                    setPrice(item.price.toString());
                    setOfferType(item.offerType);
                    setSelectedBusinessId(item.business.id);
                } else {
                    setPopUpMessage("Falha ao carregar dados do item para edição.");
                    setSeverity('error');
                    setShowMessagePopUp(true);
                    navigate('/my-businesses');
                    return;
                }
            }

            setIsLoading(false);
        };

        fetchInitialData();
    }, [user?.id, itemId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const cleanPrice = price.replace(',', '.');

        const itemData = {
            name,
            description,
            price: parseFloat(cleanPrice) || 0,
            offerType,
            businessId: selectedBusinessId,
        };

        let submitResult;

        if (isEditMode) {
            submitResult = await itemService.updateItem(itemId, itemData);
        } else {
            if (!imageFile) {
                setPopUpMessage("A imagem do item é obrigatória.");
                setSeverity('error');
                setShowMessagePopUp(true);
                setIsSubmitting(false);
                return;
            }
            submitResult = await itemService.createItem(itemData, imageFile);
        }

        if (!submitResult.success) {
            setPopUpMessage(submitResult.message || "A ação falhou, por favor tente novamente.");
            setSeverity('error');
            setShowMessagePopUp(true);
            setIsSubmitting(false);
            return;
        }

        setPopUpMessage(`Item "${name}" ${isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        setSeverity('success');
        setShowMessagePopUp(true);

        navigate(`/manage-items/${selectedBusinessId}`);
        setIsSubmitting(false);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (businessesList.length === 0 && !isLoading) {
        return (
            <div className={styles.emptyState}>
                <h2>Você precisa cadastrar um negócio primeiro.</h2>
                <button onClick={() => navigate('/new-business')} className="submitButton">
                    Ir para Cadastro de Negócio
                </button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>{isEditMode ? 'Editar Item' : 'Cadastrar Novo Item'}</h2>

                {isEditMode ? (
                    <img className="image-original" src={itemOriginalData.imageUrl} alt={name} />
                ) : (
                    <ImageUploadField
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        label="Foto do Item"
                        isSubmitting={isSubmitting}
                        isCircular={false}
                        required={true}
                    />
                )}

                <SelectField
                    label="Pertence ao Negócio"
                    id="business"
                    value={selectedBusinessId}
                    onChange={(e) => setSelectedBusinessId(e.target.value)}
                    options={businessesList.map(b => ({ key: b.id, displayName: `${b.name} - (${b.categoryDisplayName})` }))}
                    required
                    disabled={isSubmitting}
                />

                <InputField label="Nome do Item" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting} />

                <TextAreaField
                    label="Detalhes / Descrição"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={3}
                />

                <SelectField
                    label="Tipo de Oferta"
                    id="offerType"
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value)}
                    options={[
                        { key: 'PRODUCT', displayName: 'Produto (Compra Direta)' },
                        { key: 'SERVICE', displayName: 'Serviço (Contato WhatsApp)' }
                    ]}
                    required
                    disabled={isSubmitting}
                />

                <InputField
                    label="Preço (R$)"
                    id="price"
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    disabled={isSubmitting}
                    isCurrency={true}
                    inputMode="numeric"
                />

                {offerType === 'PRODUCT' && (
                    <p className={styles.commissionNote}>
                        <WarningIcon fontSize='small' />
                        Ao cadastrar um *Produto*, cobraremos uma taxa fixa de 5% sobre o valor de cada venda realizada.
                    </p>
                )}

                <div className="button-container">
                    <button type="submit" className="submit-button" disabled={isSubmitting || (!isEditMode && imageFile === null)}>
                        {isSubmitting ?
                            'Salvando...' :
                            (isEditMode ?
                                'Salvar Alterações'
                                : 'Cadastrar Item'
                            )}
                    </button>
                    {isEditMode &&
                        <button type="button" className="cancel-button" onClick={() => navigate(-1)} disabled={isSubmitting}>
                            Cancelar
                        </button>
                    }
                </div>
            </form>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}