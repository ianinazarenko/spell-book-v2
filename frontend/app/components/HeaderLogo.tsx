import { RiRefreshLine } from '@remixicon/react';

import buttonStyles from './ControlButton.module.css';
import styles from './HeaderLogo.module.css';

export function HeaderLogo() {
    function handleRefreshPage() {
        window.location.reload();
    }
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>
                <span className={styles.text}>The&nbsp;Book&nbsp;of&nbsp;Spells.</span>
            </h1>

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary} ${buttonStyles._equal}`}
                aria-label="Reload page"
                onClick={handleRefreshPage}
            >
                <RiRefreshLine size={18} aria-hidden="true" />
            </button>
        </header>
    );
}
