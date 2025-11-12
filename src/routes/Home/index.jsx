import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { BusinessService } from '../../services/BusinessService';
import MessagePopUp from '../../components/MessagePopUp';
import LoadingSpinner from '../../components/Loading';
import styles from './styles.module.css';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessagePopUp, setShowMessagePopUp] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState('');
    const businessService = new BusinessService();

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            const result = await businessService.getAllCategories();

            if (result.success) {
                setCategories(result.data);
            } else {
                setPopUpMessage(result.message || "Não foi possível carregar as categorias.");
                setShowMessagePopUp(true);
            }
            setIsLoading(false);
        };

        fetchCategories();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.homeContainer}>
            <h1>Descubra o comércio local</h1>
            <p>Selecione uma categoria para começar a explorar os negócios cadastrados:</p>

            <div className={styles.categoryGrid}>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <NavLink
                            key={category.key}
                            to={`/category/${category.key}`}
                            state={{ categoryDisplayName: category.displayName }}
                            className={styles.categoryCard}
                        >
                            <h2>{category.displayName}</h2>
                            <p>Ver todos</p>
                        </NavLink>
                    ))
                ) : (
                    <p className={styles.noData}>Nenhuma categoria encontrada no momento.</p>
                )}
            </div>

            {showMessagePopUp && (
                <MessagePopUp message={popUpMessage} showPopUp={setShowMessagePopUp} severity="error" />
            )}
        </div>
    );
}