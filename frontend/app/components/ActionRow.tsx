import { log } from 'console';
import styles from './ActionRow.module.css';
import { useState } from 'react';

interface ActionRowProps {
    durationMinutes: number;
    setDurationMinutes: (val: number) => void;
    inputValue: string;
    setInputValue: (val: string) => void;
    onAdd: () => void;
    isCasting: boolean;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ActionRow({
    durationMinutes,
    setDurationMinutes,
    inputValue,
    setInputValue,
    onAdd,
    isCasting,
    onKeyDown,
}: ActionRowProps) {
    function handleDurationChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDurationMinutes(Math.max(1, parseInt(e.target.value) || 1));
    }

    const BTN_LABEL = 'Add';
    const BASE_URL = 'http://localhost:8000';

    const [loading, setLoading] = useState<boolean>(false);

    async function handleAdd() {
        // TODO: refactor!
        onAdd();

        const body = {
            spell: inputValue ?? '',
            duration: durationMinutes ?? 0,
        };

        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/spells`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message ?? `Request failed: ${res.status} ${res.statusText}`);
            }

            console.log('Job created:', data);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            console.warn('Could not create spell!', message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.intro}>
            <p className={styles.durationHint}>duration is in minutes</p>

            <div className={styles.actionRow}>
                <input
                    type='number'
                    min='1'
                    max='360'
                    value={durationMinutes}
                    onChange={handleDurationChange}
                    className={`${styles.input} ${styles.inputSmall}`}
                    disabled={isCasting}
                    title='Duration in minutes'
                />

                <input
                    type='text'
                    placeholder='Enter a new spell...'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    className={`${styles.input} ${styles.inputMain}`}
                />

                <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={handleAdd}
                    disabled={!inputValue.trim() || loading}
                >
                    {BTN_LABEL}
                </button>
            </div>
        </div>
    );
}
