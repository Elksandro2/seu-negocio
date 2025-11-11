import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles.module.css";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
    const { isLoggedIn, user, logout } = useContext(AuthContext);

    const userName = user?.name || 'Usuário';

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <Link to="/" className={styles.logo}>
                    Seu Negócio
                </Link>

                <nav className={styles.nav}>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                        Marketplace
                    </NavLink>

                    {isLoggedIn && (
                        <NavLink to="/my-businesses" className={({ isActive }) => 
                            isActive ? styles.activeLink : styles.link
                        }>
                            Meus Negócios
                        </NavLink>
                    )}
                </nav>

                {isLoggedIn ? (
                    <div className={styles.authActions}>
                        <NavLink to="/profile" className={styles.profileLink}>
                            Olá, {userName.split(' ')[0]}
                        </NavLink>
                        <button onClick={logout} className={styles.logoutButton}>
                            Sair
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className={styles.loginButton}>
                        Entrar
                    </Link>
                )}
            </div>
        </header>
    )
}