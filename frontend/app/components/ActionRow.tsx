import styles from './ActionRow.module.css';
import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react';

interface ActionRowProps {
    onAdd: (
        e: React.SubmitEvent,
        data: { spell: string; duration: string | number }
    ) => Promise<{ success: boolean }>;
    isCasting: boolean;
}

export function ActionRow({ onAdd, isCasting }: ActionRowProps) {
    // --- Constants ---
    const BTN_LABEL = 'Add';

    // --- State ---
    const [spell, setSpell] = useState<string>('');
    const [duration, setDuration] = useState<number>(60);

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

    function handleSubmit(e: React.SubmitEvent) {
        const trimmedSpell = spell.trim();
        if (!trimmedSpell) return;

        const clearedState = '';

        startTransition(async () => {
            setOptimistincSpell(clearedState);
            const { success } = await onAdd(e, { spell: trimmedSpell, duration });

            if (success) {
                setSpell(clearedState);
            }

            spellInputRef.current?.focus();
        });
    }

    useEffect(() => {
        if (!isPending) {
            spellInputRef.current?.focus();
        }
    }, [isPending]);

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
                    onChange={handleDurationChange}
                    className={`${styles.input} ${styles.inputSmall}`}
                    disabled={isCasting || isPending}
                    title='Duration in minutes'
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
