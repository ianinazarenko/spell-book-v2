import { SpellConfig } from '@shared/spells/spells.types';

import s from './ErrorStatus.module.css';

interface Props {
    configs: SpellConfig;
    sseError: string | null;
}
export default function ErrorStatus({ configs, sseError }: Props) {
    const isError = configs.status === 'FAILED' || sseError;
    const errorMessage = configs.errorMessage || sseError;

    return <>{isError && <div className={s.errorStatus}>{errorMessage ?? 'ERRROR'}</div>}</>;
}
