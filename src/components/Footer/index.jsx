import styles from './styles.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.section}>
                    <p className={styles.title}>Projeto Marketplace - Seu Negócio</p>
                    <p>&copy; {currentYear} - Todos os direitos reservados.</p>
                </div>

                <div className={styles.section}>
                    <p className={styles.title}>Desenvolvimento e Contato</p>
                    <p>Desenvolvido por: José Elksandro</p>
                    <a href="https://www.instagram.com/_elksandro" target="_blank" className={styles.link}>
                        Instagram: @_elksandro
                    </a><br />
                    <a href="https://github.com/Elksandro2" target="_blank" className={styles.link}>
                        GitHub: Elksandro2
                    </a>
                    <p>WhatsApp: (81) 98264-8586</p>
                </div>
            </div>
        </footer>
    );
}