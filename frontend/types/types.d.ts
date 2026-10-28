import type { Dispatch, SetStateAction } from 'react';

export type SetStateFunc<T> = Dispatch<SetStateAction<T>>;
