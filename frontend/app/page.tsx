'use client';

// Types
import type { SpellItem } from '@shared/spells/spells.types';

import styles from './page.module.css';
import { useEffect, useState, useRef, useOptimistic, useTransition } from 'react';
import { useLocalStorage } from '@/lib/hooks/useStorage';

// Компоненты
import { HeaderLogo } from './components/HeaderLogo';
import { ActionRow } from './components/ActionRow';
import { SpellList } from './components/SpellList';
import { CastStatus } from './components/CastStatus';
import { RitualControls } from './components/RitualControls';
import { SpellStatus } from '../../backend/src/generated/prisma/enums';
import { loadConfigs } from '@/lib/repository/configs/configs';
import {
    castSpells,
    clearSpells,
    createSpell,
    deleteSpell,
    loadSpells,
    stopCasting,
} from '@/lib/repository/spells/spells';
import { SpellConfig } from '../../backend/src/generated/prisma/client';
import { DEFAULT_CONFIGS } from './constants/configs';
import { updateConfigs } from '@/lib/repository/configs/configs';
import { showError } from '@/lib/repository/utils';

export default function Home() {
    const SPEED = 2000;

    // Состояние страницы
    const [isPending, startTransition] = useTransition();

    const [configs, setConfigs] = useState<SpellConfig>(DEFAULT_CONFIGS);
    const [optmConfigs, setOptmConfigs] = useOptimistic(
        configs,
        (currentConfigs: SpellConfig, newConfigs: Partial<SpellConfig>) => ({
            ...currentConfigs,
            ...newConfigs,
        })
    );

    const [spells, setSpells] = useState<SpellItem[]>([]);
    const [optmSpells, optmDeleteSpell] = useOptimistic(
        spells,
        (currentItems: SpellItem[], id: string) => currentItems.filter((item) => item.id !== id)
    );

    const [isCasting, setIsCasting] = useState<boolean>(false);
    const [castCount, setCastCount] = useState<number>(0);
    const spellsRef = useRef(spells); // Пока не используется
    const pollingIntervalId = useRef<NodeJS.Timeout | null>(null);

    // Значения для отображения
    const spellsList: string[] = optmSpells.map((s) => s.spellText);
    const areSpellsSame = compareSpells(); // Пока не используется
    const spellsStr = JSON.stringify(spells);

    function compareSpells() {
        // return JSON.stringify(spells) === JSON.stringify(storedSpells);
    }

    // Ввод заклинания и настройки длительности
    async function handleConfigChange(body: {
        iterationsTotal: number;
        durationMin: number | null;
    }) {
        startTransition(async () => {
            setOptmConfigs({ iterationsTotal: 0 });
            const configs = await updateConfigs(body);

            if (configs) {
                setConfigs(configs);
                setCastCount(configs.iterationsCompleted);
            }
        });
    }

    async function handleSubmit(body: { spell: string }): Promise<{ success: boolean }> {
        if (!body.spell) {
            return { success: false };
        }

        const spell = await createSpell({ spell: body.spell });

        if (spell) {
            setSpells((prev) => [...prev, spell]);
            return { success: true };
        }

        return { success: false };
    }

    // Удаление заклинаний
    function removeSpell(indexToRemove: number) {
        const id = spells[indexToRemove].id;

        startTransition(async () => {
            optmDeleteSpell(id);
            const { success } = await deleteSpell(id);

            if (success) {
                setSpells((prev) => prev.filter((i) => i.id !== id));
            }
        });
    }

    async function clearAll() {
        try {
            await clearSpells();
            setSpells([]);
            setCastCount(0);
        } catch (e) {
            showError(e, 'clearAll');
        }
    }

    // Запуск и остановка ритуала
    async function castSpell() {
        if (isCasting || !spells.length) return;

        castSpells();
        setIsCasting(true);
    }

    async function stopSpell() {
        setIsCasting(false);
        await stopCasting();
    }

    // Периодическое чтение прогресса
    function startPolling() {
        pollingIntervalId.current = setInterval(async () => {
            const config = await loadConfigs();

            if (!config || config.status !== 'RUNNING') {
                setIsCasting(false);
                return;
            }

            console.log('✨ Casting ritual:', config.iterationsCompleted);
            setCastCount(config.iterationsCompleted);
        }, 2000);
    }

    function stopPolling() {
        if (!pollingIntervalId.current) return;
        clearInterval(pollingIntervalId.current);
        pollingIntervalId.current = null;
    }

    // При открытии страницы загружаем данные с бэка
    useEffect(() => {
        Promise.all([loadConfigs(), loadSpells()]).then(([configs, spells]) => {
            setConfigs(configs || DEFAULT_CONFIGS);
            setSpells(spells || []);
            setIsCasting(configs?.status === 'RUNNING');
            setCastCount(configs?.iterationsCompleted || 0);
        });
    }, []);

    // При изменении isCasting запускаем или останавливаем опрос
    useEffect(() => {
        if (isCasting) {
            startPolling();
        } else {
            stopPolling();
        }
    }, [isCasting]);

    // Пустой список выключает локальное отображение ритуала
    useEffect(() => {
        if (spells.length < 1 && isCasting) {
            setIsCasting(false);
        }
    }, [spells]);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <HeaderLogo />

                <div>
                    <ActionRow
                        initialDur={optmConfigs.durationMin}
                        onAdd={handleSubmit}
                        onConfigChange={handleConfigChange}
                        isCasting={isCasting}
                    />

                    <SpellList
                        spells={spellsList}
                        onRemove={removeSpell}
                    />

                    <CastStatus
                        isCasting={isCasting}
                        castCount={castCount}
                        duration={SPEED}
                    />
                </div>

                <RitualControls
                    onCast={castSpell}
                    onStop={stopSpell}
                    onClear={clearAll}
                    onSave={() => {}}
                    onRestore={() => {}}
                    isCasting={isCasting}
                    hasSpells={spells.length > 0}
                    canRestore={false}
                    areSpellsSame={false}
                    spells={spellsStr}
                />
            </main>
        </div>
    );
}
