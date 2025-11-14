import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BusinessService } from '../../../services/BusinessService';
import { ItemService } from '../../../services/ItemService';
import { AuthContext } from '../../../contexts/AuthContext';
import Loading from '../../../components/Loading';
import MessagePopUp from '../../../components/MessagePopUp';
import styles from './styles.module.css';

export default function ManageItems() {
    const { id } = useParams();
    const [business, setBusiness] = useState(null);
    const [items, setItems] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    
    const navigate = useNavigate();
    const businessService = new BusinessService();
    const itemService = new ItemService();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id || !user?.id) {
                setIsLoading(false);
                return;
            }
            
            const result = await businessService.getBusinessById(id); 
            
            if (result.success) {
                const businessData = result.data;

                if (businessData.owner.id !== user.id) {
                    setPopUpMessage("Você não tem permissão para gerenciar este negócio.");
                    setShowMessagePopUp(true);
                    navigate('/my-businesses');
                    return;
                }

                setBusiness(businessData);
                setItems(businessData.items);
            } else {
                setPopUpMessage(result.message || "Detalhes do negócio não encontrados.");
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };

        fetchDetails();
    }, [id, user?.id]);


    const handleDelete = async (itemId, itemName) => {
        if (!window.confirm(`Tem certeza que deseja remover o item "${itemName}"?`)) {
            return;
        }

        const deleteResult = await itemService.deleteItem(itemId);

        if (deleteResult.success) {
            setPopUpMessage("Item removido com sucesso!");
            setSeverity('success');
            setShowMessagePopUp(true);
            setItems(items.filter(item => item.id !== itemId));
        } else {
            setPopUpMessage(deleteResult.message || "Falha ao remover o item.");
            setSeverity('error');
            setShowMessagePopUp(true);
        }
    };


    if (isLoading) {
        return <Loading />;
    }

    if (!business) {
         return <div className="no-data-container">Negócio não encontrado.</div>;
    }
    
    const { name, categoryDisplayName } = business;

    return (
        <div className="list-container">
            <header className={styles.gestionHeader}>
                <h1 className="category-title">Gerenciar: {name}</h1>
                <Link to="/new-item" className={styles.newItemButton}>
                    + Novo Item
                </Link>
            </header>
            
            <p className="category-tag" style={{marginBottom: "30px"}}>{categoryDisplayName}</p>

            <div className="items-grid">
                {items.length > 0 ? (
                    items.map(item => (
                        <div key={item.id} className={styles.itemGestionCard}>
                            <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
                            
                            <div className={styles.cardInfo}>
                                <h3>{item.name}</h3>
                                <p>R$ {item.price ? item.price.toFixed(2) : 'A negociar'}</p>

                                <div className={styles.gestionActions}>
                                    <Link to={`/edit-item/${item.id}`} className={styles.editLink}>
                                        Editar
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(item.id, item.name)} 
                                        className={styles.deleteButton}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data-container">
                        <p className="no-data">Nenhum item cadastrado. Crie um agora!</p>
                    </div>
                )}
            </div>
            
            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity={severity} />
            )}
        </div>
    );
}