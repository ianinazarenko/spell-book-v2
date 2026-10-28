import type { SpellConfig } from '@shared/spells/spells.types';

import s from './ErrorStatus.module.css';

interface Props {
    configs: SpellConfig;
}
export default function ErrorStatus({ configs }: Props) {
    const isError = configs.status === 'FAILED';
    const errorMessage = configs.errorMessage;

    return <>{isError && <div className={s.errorStatus}>{errorMessage ?? 'ERRROR'}</div>}</>;
}
