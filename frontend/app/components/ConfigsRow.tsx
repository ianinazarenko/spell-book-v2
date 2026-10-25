import { DurationConfigs } from '@/app/components/DurationConfigs';
import { RiRefreshLine } from '@remixicon/react';
import buttonStyles from './ControlButton.module.css';
import styles from './ConfigsRow.module.css';

interface Props {
    initialDur: number | null;
    isCasting: boolean;
    isAddingSpell: boolean;
    onConfigChange: (data: {
        iterationsTotal: number;
        durationMin: number | null;
    }) => Promise<void>;
}

export default function ConfigsRow({
    initialDur,
    isCasting,
    isAddingSpell,
    onConfigChange,
}: Props) {
    function handleRefreshPage() {
        window.location.reload();
    }

    return (
        <div className={styles.row}>
            <DurationConfigs
                initialDur={initialDur}
                isCasting={isCasting}
                isAddingSpell={isAddingSpell}
                onConfigChange={onConfigChange}
            />

            <button
                className={`${buttonStyles.button} ${buttonStyles.buttonSecondary}`}
                onClick={handleRefreshPage}
            >
                <RiRefreshLine size={18} />
                Refresh
            </button>
        </div>
    );
}
