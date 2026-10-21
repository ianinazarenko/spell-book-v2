import { useEffect, useOptimistic, useRef, useState, useTransition } from 'react';

import styles from './NewSpell.module.css';

interface NewSpellProps {
    onAdd: (data: { spell: string }) => Promise<{ success: boolean }>;
}

export function NewSpell({ onAdd }: NewSpellProps) {
    const BTN_LABEL = 'Add';

    const [spell, setSpell] = useState<string>('');
    const [isPending, startTransition] = useTransition();
    const [optimisticSpell, setOptimistincSpell] = useOptimistic(
        spell,
        (_, optimisticData: string) => optimisticData
    );

    const spellInputRef = useRef<HTMLInputElement>(null);
    const isSubmitDisabled = !spell.trim() || isPending;

    function handleSpellChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSpell(e.target.value);
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

    useEffect(() => {
        if (!isPending) {
            spellInputRef.current?.focus();
        }
    }, [isPending]);

    return (
        <form
            autoComplete='off'
            className={styles.newSpell}
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
    );
}
