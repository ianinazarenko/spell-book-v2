import styles from './HeaderLogo.module.css';

export function HeaderLogo() {
    return (
        <h1 className={styles.title}>
            <span className={styles.text}>The&nbsp;Book&nbsp;of&nbsp;Spells.</span>
        </h1>
    );
}
