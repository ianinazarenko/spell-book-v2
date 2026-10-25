import { DurationConfigs } from '@/app/components/DurationConfigs';
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
    return (
        <div className={styles.row}>
            <DurationConfigs
                initialDur={initialDur}
                isCasting={isCasting}
                isAddingSpell={isAddingSpell}
                onConfigChange={onConfigChange}
            />
        </div>
    );
}
