import CopyButton from '@/app/components/CopyButton';
import buttonStyles from '@/app/components/ControlButton.module.css';
import { RiDeleteBinLine, RiHistoryLine, RiSaveLine } from '@remixicon/react';
import s from './AdditionalControls.module.css';

interface Props {
    isCasting: boolean;
    hasSpells: boolean;
    areSpellsSame: boolean;
    canRestore: boolean;
    spellsStr: string;
    onClear: () => void;
    onSave: () => void;
    onRestore: () => void;
}

export default function AdditionalControls({
    isCasting,
    hasSpells,
    onClear,
    onSave,
    onRestore,
    canRestore,
    areSpellsSame,
    spellsStr,
}: Props) {
    const isClearDisabled = isCasting || !hasSpells;
    const isSaveDisabled = isCasting || !hasSpells || areSpellsSame;
    const isRestoreDisabled = isCasting || !canRestore;
    const isCopyDisabled = !hasSpells;

    return (
        <div className={s.AdditionalControls}>
            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={onSave}
                disabled={isSaveDisabled}
            >
                <RiSaveLine size={18} aria-hidden="true" />
                Save
            </button>

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={onRestore}
                disabled={isRestoreDisabled}
            >
                <RiHistoryLine size={18} aria-hidden="true" />
                Restore
            </button>

            <CopyButton
                text={spellsStr}
                disabled={isCopyDisabled}
            />

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonDanger}`}
                onClick={onClear}
                disabled={isClearDisabled}
            >
                <RiDeleteBinLine size={18} aria-hidden="true" />
                Clear All
            </button>
        </div>
    );
}
