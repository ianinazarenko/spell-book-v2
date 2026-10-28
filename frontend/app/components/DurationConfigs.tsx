import { useState } from 'react';

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

const DEFAULT_DUR = 60;

export function DurationConfigs({
    initialDur,
    isCasting,
    isAddingSpell,
    onConfigChange,
}: DurationConfigsProps) {
    const SPELL_STEP_SEC = 2;

    const [userDuration, setUserDuration] = useState<string | null>(null);
    const [prevDuration, setPrevDuration] = useState<number | null>(null);
    const duration: string = userDuration ?? String(initialDur ?? DEFAULT_DUR);

    function handleDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserDuration(e.target.value);
    }

    function handleConfigChange() {
        if (userDuration === null) return;
        const previous = prevDuration ?? initialDur ?? DEFAULT_DUR;
        const entered = Number(userDuration);

        const duration =
            userDuration === '' || !Number.isFinite(entered) || entered === 0
                ? previous
                : Math.min(360, Math.max(0, Math.trunc(entered)));

        setUserDuration(String(duration));
        if (previous === duration) return;
        setPrevDuration(duration);

        const durationSec = duration * 60;
        const iterationsTotal = Math.round(durationSec / SPELL_STEP_SEC);

        void onConfigChange({ iterationsTotal, durationMin: duration });
    }

    return (
        <div className={styles.durationConfigs}>
            <input
                type='number'
                min='0'
                max='360'
                step={5}
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
