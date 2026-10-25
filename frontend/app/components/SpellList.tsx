import { SpellItem } from '@shared/spells/spells.types';
import { RiDeleteBinLine, RiFileCopyLine } from '@remixicon/react';
import styles from './SpellList.module.css';
import buttonStyles from './ControlButton.module.css';
import CopyButton from '@/app/components/CopyButton';

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
                    <article
                        key={spell.id}
                        className={styles.card}
                    >
                        <p className={styles.spellItem}>{spell.spellText}</p>

                        <div className={styles.icons}>
                            <CopyButton
                                text={spell.spellText}
                                size={'small'}
                                equal
                            />

                            <button
                                className={`${styles.iconWrap} ${buttonStyles.roundButtonSecondary}`}
                                onClick={() => onRemove(spell.id)}
                            >
                                <RiDeleteBinLine size={18} />
                            </button>
                        </div>
                    </article>
                ))
            )}
        </div>
    );
}
