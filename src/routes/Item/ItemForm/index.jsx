import { useState, useEffect, useContext, useRef } from 'react';
import { ItemService } from '../../../services/ItemService';
import { BusinessService } from '../../../services/BusinessService';
import { AuthContext } from '../../../contexts/AuthContext';
import MessagePopUp from '../../../components/MessagePopUp';
import InputField from '../../../components/InputField';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import ImageUploadField from '../../../components/ImageUploadField';
import SelectField from '../../../components/SelectField';
import TextAreaField from '../../../components/TextAreaField';

export default function ItemForm() {
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
        const fetchBusinesses = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }
            const result = await businessService.getMyBusinesses();
            
            if (result.success) {
                setBusinessesList(result.data);
                if (result.data.length === 1) {
                    setSelectedBusinessId(result.data[0].id);
                }
            } else {
                setPopUpMessage("Falha ao carregar a lista de seus negócios.");
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };
        
        fetchBusinesses();
    }, [user?.id]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const itemData = {
            name,
            description,
            price: parseFloat(price) || 0, 
            offerType,
            businessId: selectedBusinessId,
        };
        
        if (!imageFile) {
            setPopUpMessage("A imagem do item é obrigatória.");
            setSeverity('error');
            setShowMessagePopUp(true);
            setIsSubmitting(false);
            return;
        }

        const createResult = await itemService.createItem(itemData, imageFile);
        
        if (!createResult.success) {
            setPopUpMessage(createResult.message || "Falha ao criar o item.");
            setSeverity('error');
            setShowMessagePopUp(true);
            setIsSubmitting(false);
            return;
        }

        setPopUpMessage(`Item "${name}" criado com sucesso!`);
        setSeverity('success');
        setShowMessagePopUp(true);
        
        navigate(`/business/${selectedBusinessId}`); 
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
                <h2>Cadastrar Novo Item</h2>

                <ImageUploadField
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    label="Foto do Item"
                    isSubmitting={isSubmitting}
                    isCircular={false}
                    required={true}
                />

                <SelectField
                    label="Pertence ao Negócio" 
                    id="business" 
                    value={selectedBusinessId} 
                    onChange={(e) => setSelectedBusinessId(e.target.value)} 
                    options={businessesList.map(b => ({key: b.id, displayName: `${b.name} - (${b.categoryDisplayName})`}))}
                    required
                    disabled={isSubmitting}
                />
                
                <InputField label="Nome do Item" id="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting}/>
                
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

                <InputField label="Preço (R$)" id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required disabled={isSubmitting} min={0}/>

                <button type="submit" className="submit-button" disabled={isSubmitting || imageFile === null}>
                    {isSubmitting ? 'Salvando Item...' : 'Cadastrar Item'}
                </button>
            </form>
            
            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}