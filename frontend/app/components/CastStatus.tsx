import { HashLoader } from 'react-spinners';
import { AnimatedCount } from './AnimatedCount';
import styles from './CastStatus.module.css';

interface CastStatusProps {
    isCasting: boolean;
    castCount: number;
    duration: number;
}

export function CastStatus({ isCasting, castCount, duration }: CastStatusProps) {
    const durVal = Math.round(duration / 1000);
    const sparklesClasses = `${styles.sparkles} ${isCasting ? styles._show : ''}`;

    return (
        <>
            <div className={styles.wrapper}>
                <div className={sparklesClasses}>
                    <span className={styles.dot}></span>
                    <HashLoader loading={isCasting} size={80} />
                </div>

                <AnimatedCount value={castCount} />
            </div>

            <div className={`${styles.info} ${isCasting ? styles._show : ''}`}>
                <p>Spell is casting every {durVal} seconds...</p>
            </div>
        </>
    );
}
