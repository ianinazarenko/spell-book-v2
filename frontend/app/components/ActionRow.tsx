import { SpellConfig } from '../../../backend/src/generated/prisma/client';
import styles from './ActionRow.module.css';
import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react';

interface ActionRowProps {
    isCasting: boolean;
    initialDur: number | null;
    onAdd: (data: { spell: string }) => Promise<{ success: boolean }>;
    onConfigChange: (data: {
        iterationsTotal: number;
        durationMin: number | null;
    }) => Promise<void>;
}

export function ActionRow({ initialDur, onAdd, onConfigChange, isCasting }: ActionRowProps) {
    // --- Constants ---
    const BTN_LABEL = 'Add';
    const SPELL_STEP_SEC = 2;

    // --- State ---
    const [spell, setSpell] = useState<string>('');
    const [duration, setDuration] = useState<number>(initialDur || 60);
    const [prevDuration, setPrevDuration] = useState<number>(duration);

    // Spell optimistic update
    const [isPending, startTransition] = useTransition();
    const [optimisticSpell, setOptimistincSpell] = useOptimistic(
        spell,
        (_, optimisticData: string) => optimisticData
    );

    const spellInputRef = useRef<HTMLInputElement>(null);
    const isSubmitDisabled = !spell.trim() || isPending;

    // --- Handlers ---
    function handleSpellChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSpell(e.target.value);
    }

    function handleDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPrevDuration(duration);
        setDuration(Math.max(1, parseInt(e.target.value) || 1));
    }

    function handleConfigChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (prevDuration === duration) return;
        setPrevDuration(duration); // if there was only blur event

        const durationSec = duration * 60;
        const iterationsTotal = Math.round(durationSec / SPELL_STEP_SEC);

        onConfigChange({ iterationsTotal, durationMin: duration });
    }

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        const trimmedSpell = spell.trim();
        if (!trimmedSpell) return;

        const clearedState = '';

        startTransition(async () => {
            setOptimistincSpell(clearedState);
            const { success } = await onAdd({ spell: trimmedSpell });

            if (success) {
                setSpell(clearedState);
            }
        });
    }

    // --- Effects ---
    useEffect(() => {
        if (!isPending) {
            spellInputRef.current?.focus();
        }
    }, [isPending]);

    useEffect(() => {
        if (initialDur && initialDur !== duration) {
            if (duration) setPrevDuration(duration);
            setDuration(initialDur);
        }
    }, [initialDur]);

    return (
        <div className={styles.intro}>
            <p className={styles.durationHint}>duration is in minutes</p>

            <div className={styles.actionRow}>
                <input
                    type='number'
                    min='1'
                    max='360'
                    value={duration}
                    className={`${styles.input} ${styles.inputSmall}`}
                    disabled={isCasting || isPending}
                    title='Duration in minutes'
                    onChange={handleDurationChange}
                    onBlur={handleConfigChange}
                />

                <form
                    autoComplete='off'
                    className={styles.actionRow}
                    onSubmit={handleSubmit}
                >
                    <input
                        type='text'
                        placeholder='Enter a new spell...'
                        value={optimisticSpell}
                        ref={spellInputRef}
                        onChange={handleSpellChange}
                        className={`${styles.input} ${styles.inputMain}`}
                        disabled={isPending}
                    />

                    <button
                        type='submit'
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        disabled={isSubmitDisabled}
                    >
                        {BTN_LABEL}
                    </button>
                </form>
            </div>
        </div>
    );
}
