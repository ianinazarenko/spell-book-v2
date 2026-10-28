import { useState } from 'react';

import styles from '@/app/components/AnimatedCount.module.css';

interface IProps {
    value: number;
}

export function AnimatedCount({ value }: IProps) {
    const [prevValue, setPrevValue] = useState<number | null>(null);
    const [displayValue, setDisplayValue] = useState<number>(value);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const prevClasses = `${styles.digit} ${styles.previous} ${isAnimating ? styles._animating : ''}`;
    const currentClasses = `${styles.digit} ${styles.current} ${isAnimating ? styles._animating : ''}`;

    if (value !== displayValue) {
        setPrevValue(displayValue);
        setIsAnimating(true);
        setDisplayValue(value);
    }

    function handleStopAnimation() {
        setIsAnimating(false);
        setPrevValue(null);
    }

    return (
        <div className={`${styles.wrapper}`}>
            {prevValue !== null && (
                <div
                    className={prevClasses}
                    onAnimationEnd={handleStopAnimation}
                >
                    {prevValue}
                </div>
            )}

            <div className={currentClasses}>{displayValue}</div>
        </div>
    );
}
