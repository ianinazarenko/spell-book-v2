import { SpellConfig } from '../../../backend/src/generated/prisma/client';
import styles from './ActionRow.module.css';
import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react';

interface ActionRowProps {
    isCasting: boolean;
    initialDur: number | null;
    onAdd: (e: React.SubmitEvent, data: { spell: string }) => Promise<{ success: boolean }>;
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
        setDuration(Math.max(1, parseInt(e.target.value) || 1));
    }

    function handleConfigChange() {
        const durationSec = duration * 60;
        const iterationsTotal = Math.round(durationSec / SPELL_STEP_SEC);
        onConfigChange({ iterationsTotal, durationMin: duration });
    }

    function handleSubmit(e: React.SubmitEvent) {
        const trimmedSpell = spell.trim();
        if (!trimmedSpell) return;

        const clearedState = '';

        startTransition(async () => {
            setOptimistincSpell(clearedState);
            const { success } = await onAdd(e, { spell: trimmedSpell });

            if (success) {
                setSpell(clearedState);
            }

            spellInputRef.current?.focus();
        });
    }

    // --- Effects ---
    useEffect(() => {
        if (!isPending) {
            spellInputRef.current?.focus();
        }
    }, [isPending]);

    useEffect(() => {
        if (initialDur) {
            setDuration(initialDur);
        }
    }, [initialDur]);

    return (
        <div className={styles.intro}>
            <p className={styles.durationHint}>duration is in minutes</p>

            <form
                autoComplete='off'
                className={styles.actionRow}
                onSubmit={handleSubmit}
            >
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
    );
}
