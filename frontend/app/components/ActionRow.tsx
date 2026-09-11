import styles from './ActionRow.module.css';

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

    return (
        <div className={styles.intro}>
            <p className={styles.durationHint}>duration is in minutes</p>

            <div className={styles.actionRow}>
                <input
                    type="number"
                    min="1"
                    max="999"
                    value={durationMinutes}
                    onChange={handleDurationChange}
                    className={`${styles.input} ${styles.inputSmall}`}
                    disabled={isCasting}
                    title="Duration in minutes"
                />

                <input
                    type="text"
                    placeholder="Enter a new spell..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    className={`${styles.input} ${styles.inputMain}`}
                />

                <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={onAdd}
                    disabled={!inputValue.trim()}
                >
                    Add
                </button>
            </div>
        </div>
    );
}
