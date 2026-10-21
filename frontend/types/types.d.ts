import { Dispatch, SetStateAction } from 'react';

export type SetStateFunc<T> = Dispatch<SetStateAction<T>>;

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';
