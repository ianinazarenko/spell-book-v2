import type { JSX } from 'react';

import CopyButton from '@/app/components/CopyButton';
import { useIsHydrated } from '@/lib/hooks/useIsHydrated';

import buttonStyles from '@/app/components/ControlButton.module.css';
import styles from '@/app/components/RitualControls.module.css';

interface RitualControlsProps {
    onCast: () => void;
    onStop: () => void;
    onClear: () => void;
    onSave: () => void;
    onRestore: () => void;
    isCasting: boolean;
    hasSpells: boolean;
    canRestore: boolean;
    areSpellsSame: boolean;
    spells: string;
}

export function RitualControls({
    onCast,
    onStop,
    onClear,
    onSave,
    onRestore,
    isCasting,
    hasSpells,
    canRestore,
    areSpellsSame,
    spells,
}: RitualControlsProps): JSX.Element {
    const isHydrated = useIsHydrated();

    const isCastDisabled = isCasting || !hasSpells;
    const isClearDisabled = isCasting || !hasSpells;
    const isSaveDisabled = isCasting || !hasSpells || areSpellsSame;
    const isRestoreDisabled = isCasting || !canRestore;
    const isCopyDisabled = !hasSpells;

    if (!isHydrated) {
        return <div className={`${styles.ctas} ${styles.ctasPlaceholder}`} aria-hidden="true" />;
    }

    return (
        <div className={`${styles.ctas} ${styles.ctasReady}`}>
            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonPrimary}`}
                onClick={onCast}
                disabled={isCastDisabled}
            >
                Cast a spell
            </button>

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={onStop}
                disabled={!isCasting}
            >
                Stop the spell
            </button>

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={onClear}
                disabled={isClearDisabled}
            >
                Clear All
            </button>

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={onSave}
                disabled={isSaveDisabled}
            >
                Save
            </button>

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={onRestore}
                disabled={isRestoreDisabled}
            >
                Restore
            </button>

            <CopyButton text={spells} disabled={isCopyDisabled} />
        </div>
    );
}
