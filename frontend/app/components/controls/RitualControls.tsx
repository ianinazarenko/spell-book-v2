import type { SpellItem } from '@shared/spells/spells.types';
import type { JSX } from 'react';

import { RiMagicLine, RiStopCircleLine } from '@remixicon/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import TheModal from '@/app/components/common/TheModal';
import buttonStyles from '@/app/components/ControlButton.module.css';
import AdditionalControls from '@/app/components/controls/AdditionalControls';
import styles from '@/app/components/controls/RitualControls.module.css';
import { useIsHydrated } from '@/lib/hooks/useIsHydrated';

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
    spells: SpellItem[];
}

export function RitualControls({
    onCast,
    onStop,
    isCasting,
    hasSpells,
    onClear,
    onSave,
    onRestore,
    canRestore,
    areSpellsSame,
    spells,
    // duration,
    // percent,
}: RitualControlsProps): JSX.Element {
    const isHydrated = useIsHydrated();

    // Modal
    const [open, setOpen] = useState(false);
    const [rendered, setRendered] = useState(open);

    const isCastDisabled = !isCasting && !hasSpells;

    const spellsTextArr: string[] = spells.map((s) => s.spellText);
    const spellsStr: string = JSON.stringify(spellsTextArr);

    const castBtnText = isCasting ? 'Stop the spell' : 'Cast a spell';
    const CastIcon = isCasting ? RiStopCircleLine : RiMagicLine;

    // const style = {
    //     ['--duration']: `${duration}ms`,
    //     transform: `scaleX(${percent})`,
    // };

    if (!isHydrated) {
        return (
            <div
                className={`${styles.ctas} ${styles.ctasPlaceholder}`}
                aria-hidden='true'
            />
        );
    }

    function onClickMore() {
        setRendered(true);
        setOpen(true);
    }

    function onClose() {
        setOpen(false);
    }

    function onAnimationEnd() {
        setRendered(false);
    }

    return (
        <div className={`${styles.container} ${styles.ctas} ${styles.ctasReady}`}>
            {/*<div>Progress...</div>*/}

            <div className={styles.percent}>
                {/*<span*/}
                {/*    className={styles.percentInner}*/}
                {/*    style={style}*/}
                {/*></span>*/}
            </div>
            <div className={`${styles.row}`}>
                <button
                    className={`${buttonStyles.button} ${buttonStyles.buttonPrimary} ${styles.castButton}`}
                    onClick={isCasting ? onStop : onCast}
                    disabled={isCastDisabled}
                >
                    <span
                        key={String(isCasting)}
                        className={styles.castButtonStatus}
                    >
                        <CastIcon
                            size={18}
                            aria-hidden='true'
                        />
                        <span>{castBtnText}</span>
                    </span>
                </button>

                <div className={styles.additionalControls}>
                    <AdditionalControls
                        isCasting={isCasting}
                        hasSpells={hasSpells}
                        areSpellsSame={areSpellsSame}
                        canRestore={canRestore}
                        spellsStr={spellsStr}
                        onClear={onClear}
                        onRestore={onRestore}
                        onSave={onSave}
                    />
                </div>

                {/* TODO: open bottom sheet & pop-up */}
                <button
                    className={`${buttonStyles.button} ${buttonStyles.buttonSecondary} ${styles.moreButton}`}
                    onClick={onClickMore}
                >
                    More
                </button>
            </div>

            {rendered &&
                createPortal(
                    <TheModal
                        open={open}
                        title={'Additional controls'}
                        handleClose={onClose}
                        handleAnimationEnd={onAnimationEnd}
                    >
                        <AdditionalControls
                            onClear={onClear}
                            onSave={onSave}
                            onRestore={onRestore}
                            isCasting={isCasting}
                            hasSpells={hasSpells}
                            canRestore={canRestore}
                            areSpellsSame={areSpellsSame}
                            spellsStr={spellsStr}
                        />
                    </TheModal>,
                    document.body
                )}
        </div>
    );
}
