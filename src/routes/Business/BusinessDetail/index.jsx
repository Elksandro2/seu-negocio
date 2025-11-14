import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BusinessService } from '../../../services/BusinessService';
import MessagePopUp from '../../../components/MessagePopUp';
import styles from '../styles.module.css';
import ItemCard from '../../../components/ItemCard';
import { AuthContext } from '../../../contexts/AuthContext';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import Loading from '../../../components/Loading';

export default function BusinessDetail() {
    const { id } = useParams();

    const [business, setBusiness] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const navigate = useNavigate();

    const { user, isLoggedIn } = useContext(AuthContext);

    const businessService = new BusinessService();

    useEffect(() => {
        const fetchBusinessDetail = async () => {
            if (!id) return;

            setIsLoading(true);
            const result = await businessService.getBusinessById(id);

            if (result.success) {
                setBusiness(result.data);
            } else {
                setPopUpMessage(result.message || `Não foi possível carregar os detalhes do negócio.`);
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };

        fetchBusinessDetail();
    }, [id]);

    const handleDeleteBusiness = async () => {
        if (!window.confirm(`Tem certeza que deseja remover o negócio "${business.name}"? Esta ação é irreversível e removerá todos os itens.`)) {
            return;
        }

        const deleteResult = await businessService.deleteBusiness(business.id);

        if (deleteResult.success) {
            setPopUpMessage("Negócio removido com sucesso!");
            navigate('/my-businesses');
        } else {
            setPopUpMessage(deleteResult.message || "Falha ao remover o negócio.");
            setShowMessagePopUp(true);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!business) {
        return (
            <div className={styles.detailContainer}>
                <p className="no-data">Negócio não encontrado ou removido.</p>
            </div>
        );
    }

    const { name, description, address, logoUrl, items, categoryDisplayName, owner } = business;

    const isOwner = isLoggedIn && user?.id === owner.id;

    return (
        <div className={styles.detailContainer}>
            <header className={styles.detailHeader}>
                <img src={logoUrl} alt={`Logo ${name}`} className={styles.largeLogo} />
                <div className={styles.headerInfo}>
                    <div>
                        <h1 className={styles.businessName}>{name}</h1>
                        <p className={styles.businessAddress}>{address}</p>
                        <span className="category-tag">{categoryDisplayName}</span>
                    </div>

                    {isOwner && (
                        <div className={styles.gestionIcons}>
                            <Link to={`/edit-business/${id}`} className={styles.editIcon}>
                                <BsPencilSquare size={24} />
                            </Link>
                            <BsTrash
                                size={24}
                                className={styles.deleteIcon}
                                onClick={handleDeleteBusiness}
                            />
                        </div>
                    )}
                </div>
            </header>

            <section className={styles.detailSection}>
                <h2 className={styles.sectionTitle}>Sobre Nós</h2>
                <p className={styles.descriptionText}>{description}</p>
            </section>

            <section className={styles.detailSection}>
                <h2 className={styles.sectionTitle}>Produtos e Serviços ({items.length})</h2>

                {isOwner && (
                    <div className={styles.itemGestionLink}>
                        <Link to={`/manage-items/${id}`} className="new-button">
                            Gerenciar Itens (Adicionar/Remover)
                        </Link>
                    </div>
                )}

                <div className="items-grid">
                    {items.length > 0 ? (
                        items.map(item => (
                            <ItemCard key={item.id} item={item} />
                        ))
                    ) : (
                        <p className="no-data">Nenhum item cadastrado por este negócio.</p>
                    )}
                </div>
            </section>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity="error" />
            )}
        </div>
    );
}