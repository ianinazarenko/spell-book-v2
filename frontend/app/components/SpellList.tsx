import styles from './SpellList.module.css';

interface SpellListProps {
    spells: string[];
    onRemove: (index: number) => void;
}

export function SpellList({ spells, onRemove }: SpellListProps) {
    return (
        <div className={styles.spellList}>
            {spells.length === 0 ? (
                <p>Your book is currently empty...</p>
            ) : (
                spells.map((spell, index) => (
                    <p key={index} className={styles.spellItem} onClick={() => onRemove(index)}>
                        {spell}
                    </p>
                ))
            )}
        </div>
    );
}
