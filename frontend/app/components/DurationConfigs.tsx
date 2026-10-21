import { useEffect, useState } from 'react';

import styles from './DurationConfigs.module.css';

interface DurationConfigsProps {
    initialDur: number | null;
    isCasting: boolean;
    isAddingSpell: boolean;
    onConfigChange: (data: {
        iterationsTotal: number;
        durationMin: number | null;
    }) => Promise<void>;
}

export function DurationConfigs({ initialDur, isCasting, isAddingSpell, onConfigChange }: DurationConfigsProps) {
    const SPELL_STEP_SEC = 2;

    const [duration, setDuration] = useState<number>(initialDur || 60);
    const [prevDuration, setPrevDuration] = useState<number>(duration);

    function handleDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPrevDuration(duration);
        setDuration(Math.max(1, parseInt(e.target.value) || 1));
    }

    function handleConfigChange() {
        if (prevDuration === duration) return;
        setPrevDuration(duration);

        const durationSec = duration * 60;
        const iterationsTotal = Math.round(durationSec / SPELL_STEP_SEC);

        onConfigChange({ iterationsTotal, durationMin: duration });
    }

    useEffect(() => {
        if (initialDur && initialDur !== duration) {
            if (duration) setPrevDuration(duration);
            setDuration(initialDur);
        }
    }, [initialDur]);

    return (
        <div className={styles.durationConfigs}>
            <input
                type='number'
                min='0'
                max='360'
                value={duration}
                className={styles.input}
                disabled={isCasting || isAddingSpell}
                title='Duration in minutes'
                onChange={handleDurationChange}
                onBlur={handleConfigChange}
            />

            <p className={styles.durationHint}>min</p>
        </div>
    );
}
