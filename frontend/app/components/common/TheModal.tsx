import { RiCloseLine } from '@remixicon/react';
import React from 'react';

import buttonStyles from '../ControlButton.module.css';

import s from './TheModal.module.css';

interface Props {
    open: boolean;
    title: string | null;
    children: React.ReactNode;
    handleClose: () => void;
    handleAnimationEnd: () => void;
}

export default function TheModal({
    open,
    title,
    children,
    handleClose,
    handleAnimationEnd,
}: Props) {
    function onAnimationEnd(event: React.AnimationEvent) {
        if (!open && event.target === event.currentTarget) {
            handleAnimationEnd();
        }
    }

    return (
        <div className={`${s.wrapper} ${open ? s._opening : s._closing}`}>
            <div
                className={s.overlay}
                onAnimationEnd={onAnimationEnd}
            />

            <div className={s.content}>
                <div className={s.header}>
                    <button
                        className={`${buttonStyles.roundButton} ${buttonStyles.roundButtonPrimary}`}
                        onClick={handleClose}
                    >
                        <RiCloseLine
                            size={20}
                            className={s.closeIcon}
                        />
                    </button>
                    {title && <div className={s.title}>{title}</div>}
                </div>

                <div className={s.body}>{children}</div>
            </div>
        </div>
    );
}
