import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles.module.css";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
    const { isLoggedIn, user, logout } = useContext(AuthContext);

    const userName = user?.name.split(' ')[0] || 'Usuário';

    return (
        <header className={styles.header}>
            <div className={styles.content}>
                <Link to="/" className={styles.logo}>
                    Seu Negócio
                </Link>

                <nav className={styles.nav}>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `${styles.link} ${isActive ? styles.activeLink : ''}`
                        }
                    >
                        Marketplace
                    </NavLink>

                    {isLoggedIn && (
                        <NavLink
                            to="/my-businesses"
                            className={({ isActive }) =>
                                `${styles.link} ${isActive ? styles.activeLink : ''}`
                            }
                        >
                            Meus Negócios
                        </NavLink>
                    )}
                </nav>

                {isLoggedIn ? (
                    <div className={styles.authActions}>
                        <NavLink to="/profile" className={styles.profileLink}>
                            Olá, {userName}
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