import { SpellItem } from '@shared/spells/spells.types';
import styles from './SpellList.module.css';

interface SpellListProps {
    spells: SpellItem[];
    onRemove: (index: string) => void;
}

export function SpellList({ spells, onRemove }: SpellListProps) {
    return (
        <div className={styles.spellList}>
            {spells.length === 0 ? (
                <p>Your book is currently empty...</p>
            ) : (
                spells.map((spell) => (
                    <p
                        key={spell.id}
                        className={styles.spellItem}
                        onClick={() => onRemove(spell.id)}
                    >
                        {spell.spellText}
                    </p>
                ))
            )}
        </div>
    );
}
