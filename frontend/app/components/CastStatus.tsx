import { HashLoader } from 'react-spinners';
import { AnimatedCount } from './AnimatedCount';
import styles from './CastStatus.module.css';

interface CastStatusProps {
    isCasting: boolean;
    castCount: number;
    castTotal: number;
    duration: number;
}

export function CastStatus({ isCasting, castCount, castTotal, duration }: CastStatusProps) {
    const durVal = Math.round(duration / 1000);
    const percent = Math.round((castCount / castTotal) * 100) / 100;
    const sparklesClasses = `${styles.sparkles} ${isCasting ? styles._show : ''}`;

    const style = {
        ['--duration']: `${duration}ms`,
        transform: `scaleX(${percent})`,
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div className={sparklesClasses}>
                    <span className={styles.dot}></span>
                    <HashLoader
                        loading={isCasting}
                        size={80}
                    />
                </div>

                <AnimatedCount value={castCount} />
            </div>

            <div className={styles.percent}>
                <span
                    className={styles.percentInner}
                    style={style}
                ></span>
            </div>

            <div className={`${styles.info} ${isCasting ? styles._show : ''}`}>
                <p>Spell is casting every {durVal} seconds...</p>
            </div>
        </>
    );
}
