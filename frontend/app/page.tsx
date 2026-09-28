'use client';

// Types
import { SavedSpellItem, type SpellItem } from '@shared/spells/spells.types';

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
    loadSavedSpells,
    loadSpells,
    restoreSpells,
    saveSpells,
    stopCasting,
} from '@/lib/repository/spells/spells';
import { SpellConfig } from '../../backend/src/generated/prisma/client';
import { DEFAULT_CONFIGS } from './constants/configs';
import { updateConfigs } from '@/lib/repository/configs/configs';

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
        (currentItems: SpellItem[], idList: string[]) =>
            currentItems.filter((item) => !idList.includes(item.id))
    );

    const [savedSpells, setSavedSpells] = useState<SavedSpellItem[]>([]);

    const [isCasting, setIsCasting] = useState<boolean>(false);
    const [castCount, setCastCount] = useState<number>(0);
    const spellsRef = useRef(spells); // Пока не используется
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);

    // Значения для отображения
    const areSpellsSame = compareSpells();
    const canRestore = savedSpells.length > 0 && !areSpellsSame;

    function compareSpells() {
        const spellsIds = spells.map((s) => s.id);
        const savedIds = savedSpells.map((s) => s.id);
        return (
            spellsIds.length === savedIds.length && spellsIds.every((id) => savedIds.includes(id))
        );
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
    function removeSpell(id: string) {
        startTransition(async () => {
            optmDeleteSpell([id]);
            const result = await deleteSpell(id);

            console.log(result);

            if (result.success) {
                setSpells((prev) => prev.filter((i) => i.id !== id));
            }
        });
    }

    async function clearAll() {
        startTransition(async () => {
            optmDeleteSpell(spells.map((s) => s.id));
            const result = await clearSpells();

            if (result.success) {
                setSpells([]);
                setCastCount(0);
            }
        });
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
        timerIdRef.current = setInterval(async () => {
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
        if (!timerIdRef.current) return;
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
    }

    //Сохранение и восстановление из отдельной таблицы
    async function handleSave() {
        const savedSpells = await saveSpells();
        setSavedSpells(savedSpells);
    }

    async function handleRestore() {
        const restoredSpells = await restoreSpells();
        setSpells(restoredSpells);
    }

    // При открытии страницы загружаем данные с бэка
    useEffect(() => {
        Promise.all([loadConfigs(), loadSpells(), loadSavedSpells()]).then(
            ([configs, spells, savedSpells]) => {
                setConfigs(configs || DEFAULT_CONFIGS);
                setSpells(spells || []);
                setSavedSpells(savedSpells);
                setIsCasting(configs?.status === 'RUNNING');
                setCastCount(configs?.iterationsCompleted || 0);

                console.log(spells, savedSpells);
            }
        );
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
                        initialDur={configs.durationMin}
                        onAdd={handleSubmit}
                        onConfigChange={handleConfigChange}
                        isCasting={isCasting}
                    />

                    <SpellList
                        spells={optmSpells}
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
                    onSave={handleSave}
                    onRestore={handleRestore}
                    isCasting={isCasting}
                    hasSpells={spells.length > 0}
                    canRestore={canRestore}
                    areSpellsSame={areSpellsSame}
                    spells={spells}
                />
            </main>
        </div>
    );
}
