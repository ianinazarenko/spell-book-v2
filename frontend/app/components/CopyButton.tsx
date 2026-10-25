import { useState, useRef, useEffect } from 'react';
import { RiCheckLine, RiCloseLine, RiFileCopyLine } from '@remixicon/react';
import buttonStyles from './ControlButton.module.css';
import styles from './CopyButton.module.css';

enum EStatus {
    Success = 'success',
    Error = 'error',
    Idle = 'idle',
}

const TIMEOUT = 5000;

interface CopyButtonProps {
    text: string;
    size?: string;
    disabled?: boolean;
    equal?: boolean;
}

export default function CopyButton({
    text,
    size = 'medium',
    disabled = false,
    equal = false,
}: CopyButtonProps) {
    const [status, setStatus] = useState<EStatus>(EStatus.Idle);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- Derived state
    const statusClassName =
        status === EStatus.Success
            ? styles.copyButtonSuccess
            : status === EStatus.Error
              ? styles.copyButtonError
              : '';

    const statusLabel = {
        [EStatus.Idle]: 'Copy',
        [EStatus.Error]: 'Failed',
        [EStatus.Success]: 'Copied',
    }[status];

    const StatusIcon = {
        [EStatus.Idle]: RiFileCopyLine,
        [EStatus.Error]: RiCloseLine,
        [EStatus.Success]: RiCheckLine,
    }[status];

    const sizeClass =
        {
            small: buttonStyles._small,
            medium: buttonStyles._medium,
        }[size] ?? buttonStyles._medium;

    const classes =
        `${buttonStyles.button} ${buttonStyles.buttonSecondary} ${styles.copyButton} ${statusClassName} ${sizeClass} ${equal ? buttonStyles._equal : ''}`.trim();

    // --- Handlers ---
    async function handleCopy() {
        if (disabled) return;

        setStatus(EStatus.Idle);

        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        try {
            await navigator.clipboard.writeText(text);
            setStatus(EStatus.Success);
            console.log(text);
        } catch (err) {
            console.warn('Could not write to clipboard:', err);
            setStatus(EStatus.Error);
        } finally {
            timeout.current = setTimeout(() => {
                setStatus(EStatus.Idle);
            }, TIMEOUT);
        }
    }

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, []);

    return (
        <button
            className={classes}
            onClick={handleCopy}
            disabled={disabled}
        >
            <span
                key={status}
                className={styles.status}
                aria-live='polite'
                aria-atomic='true'
            >
                <StatusIcon
                    size={18}
                    aria-hidden='true'
                />

                {!equal && <span className={styles.label}>{statusLabel}</span>}
            </span>
        </button>
    );
}
