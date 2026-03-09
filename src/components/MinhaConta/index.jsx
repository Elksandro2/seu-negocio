import { Bag, Heart, Person } from "react-bootstrap-icons";
import styles from "./styles.module.css";
import { NavLink } from "react-router-dom";

export default function MinhaConta() {

    const getNavLinkClass = ({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem;

    return (
        <div className={styles.wrapper}>
            <h3 className="mb-0">Minha Conta</h3>
            <div className={styles.optionsContainer}>
                <div>
                    <NavLink to="/profile" className={getNavLinkClass}>
                        <Person />
                        <span>Perfil</span>
                    </NavLink>
                </div>
                <div>
                    <NavLink to="/favorites" className={getNavLinkClass}>
                        <Heart />
                        <span>Favoritos</span>
                    </NavLink>
                </div>
                <div>
                    <NavLink to="/orders" className={getNavLinkClass}>
                        <Bag />
                        <span>Pedidos</span>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}