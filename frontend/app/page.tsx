'use client';

// Types
import { SavedSpellItem, type SpellItem } from '@shared/spells/spells.types';
import { SpellConfig } from '@shared/spells/spells.types';

import styles from './page.module.css';
import { useEffect, useState, useRef, useOptimistic, useTransition } from 'react';

// Компоненты
import { HeaderLogo } from './components/HeaderLogo';
import { DurationConfigs } from './components/DurationConfigs';
import { NewSpell } from './components/NewSpell';
import { SpellList } from './components/SpellList';
import { CastStatus } from './components/CastStatus';
import { RitualControls } from './components/controls/RitualControls';
import { clearCount, getCount, loadConfigs } from '@/lib/repository/configs/configs';
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
import { updateConfigs } from '@/lib/repository/configs/configs';
import ErrorStatus from '@/app/components/ErrorStatus';
import { useSpellConfig } from '@/lib/hooks/useSpellConfig';
import NotificationsToggle from '@/app/components/NotificationsToggle';
import ServiceStatuses from '@/app/components/ServiceStatuses';
import ConfigsRow from '@/app/components/ConfigsRow';

export default function Home() {
    const SPEED = 2000;

    // Состояние страницы
    const [isPending, startTransition] = useTransition();

    const [isAddingSpell, setIsAddingSpell] = useState(false);

    // --- Configs
    const { configs, applyConfigsChange, sseStatus } = useSpellConfig();

    const [optmConfigs, setOptmConfigs] = useOptimistic(
        configs,
        (currentConfigs: SpellConfig, newConfigs: Partial<SpellConfig>) => ({
            ...currentConfigs,
            ...newConfigs,
        })
    );

    // --- Spells
    const [spells, setSpells] = useState<SpellItem[]>([]);
    const [optmSpells, optmDeleteSpell] = useOptimistic(
        spells,
        (currentItems: SpellItem[], idList: string[]) =>
            currentItems.filter((item) => !idList.includes(item.id))
    );

    const [savedSpells, setSavedSpells] = useState<SavedSpellItem[]>([]);

    // Значения для отображения
    const areSpellsSame = compareSpells();
    const canRestore = savedSpells.length > 0 && !areSpellsSame;
    const isCompleted = optmConfigs.status === 'COMPLETED';
    const isCasting = optmConfigs.status === 'RUNNING';

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
    }): Promise<void> {
        startTransition(async () => {
            setOptmConfigs({
                iterationsTotal: body.iterationsTotal,
                durationMin: body.durationMin,
            });

            const configs = await updateConfigs(body);
            if (configs) {
                applyConfigsChange(configs);
            }
        });
    }

    async function handleSubmit(body: { spell: string }): Promise<{ success: boolean }> {
        if (!body.spell) {
            return { success: false };
        }

        setIsAddingSpell(true);

        try {
            const spell = await createSpell({ spell: body.spell });

            if (spell) {
                setSpells((prev) => [...prev, spell]);
                return { success: true };
            }

            return { success: false };
        } finally {
            setIsAddingSpell(false);
        }
    }

    // Удаление заклинаний
    function removeSpell(id: string) {
        startTransition(async () => {
            optmDeleteSpell([id]);
            const result = await deleteSpell(id);

            if (result.success) {
                setSpells((prev) => prev.filter((i) => i.id !== id));
            }
        });
    }

    async function clearAll() {
        startTransition(async () => {
            optmDeleteSpell(spells.map((s) => s.id));

            const [result, configs] = await Promise.all([clearSpells(), clearCount()]);

            if (result.success) {
                setSpells([]);
            }

            if (configs) {
                applyConfigsChange(configs);
            }
        });
    }

    // Запуск и остановка ритуала
    async function castSpell() {
        if (isCasting || !spells.length) return;

        startTransition(async () => {
            if (
                configs.status === 'COMPLETED' ||
                configs.iterationsCompleted >= configs.iterationsTotal
            ) {
                setOptmConfigs({ iterationsCompleted: 0, status: 'QUEUED' });
            }

            const data = await castSpells();

            applyConfigsChange(data);
        });
    }

    async function stopSpell() {
        startTransition(async () => {
            setOptmConfigs({ status: 'QUEUED' });
            const { status } = await stopCasting();

            applyConfigsChange({ status });
        });
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
        Promise.all([loadSpells(), loadSavedSpells()]).then(([spells, savedSpells]) => {
            setSpells(spells || []);
            setSavedSpells(savedSpells);
        });
    }, []);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <HeaderLogo />

                <div className={styles.spellContent}>
                    <ServiceStatuses connectionStatus={sseStatus} />

                    <ConfigsRow
                        initialDur={optmConfigs.durationMin}
                        isCasting={isCasting}
                        isAddingSpell={isAddingSpell}
                        onConfigChange={handleConfigChange}
                    />

                    <CastStatus
                        isCasting={isCasting}
                        isCompleted={isCompleted}
                        castCount={optmConfigs.iterationsCompleted}
                        castTotal={optmConfigs.iterationsTotal}
                        duration={SPEED}
                    />

                    <ErrorStatus configs={configs} />

                    <NewSpell onAdd={handleSubmit} />

                    <SpellList
                        spells={optmSpells}
                        onRemove={removeSpell}
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
