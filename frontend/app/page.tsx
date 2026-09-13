'use client';

// Types
import { ISpellJob } from './types/spells';

import styles from './page.module.css';
import { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from '@/lib/hooks/useStorage';

// Компоненты
import { HeaderLogo } from './components/HeaderLogo';
import { ActionRow } from './components/ActionRow';
import { SpellList } from './components/SpellList';
import { CastStatus } from './components/CastStatus';
import { RitualControls } from './components/RitualControls';

export default function Home() {
    // --- Константы ---
    const SPEED = 2000;
    const SPELLS_KEY = 'spells';
    const DUR_KEY = 'cast-duration';

    // --- NEW LOGIC ---
    // --- Back-end sync ---
    const baseUrl = process.env.BASE_URL ?? 'http://localhost:8000';
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [spells, setSpells] = useState<ISpellJob[]>([]);
    const spellsList: string[] = spells.map((s) => s.spell);
    // --- end region ---

    // --- Состояние (UI) ---
    const [storedSpells, setStoredSpells] = useLocalStorage<string[]>(SPELLS_KEY, []);
    const [durationMinutes, setDurationMinutes] = useLocalStorage<number>(DUR_KEY, 60);

    const [isCasting, setIsCasting] = useState<boolean>(false);
    const [castCount, setCastCount] = useState<number>(0);

    const hasStoredSpells = storedSpells.length > 0;
    const areSpellsSame = compareSpells();
    const canRestore = hasStoredSpells && !areSpellsSame;
    const spellsStr = JSON.stringify(spells);

    // --- Refs (Логика & Таймеры) ---
    const spellsRef = useRef(spells);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

    // Синхронизируем "зеркало" для интервала
    // useEffect(() => {
    // spellsRef.current = spells;
    // }, [spells]);

    // --- Utils ---
    function compareSpells() {
        return JSON.stringify(spells) === JSON.stringify(storedSpells);
    }

    // --- Магические действия (CRUD) ---
    function removeSpell(indexToRemove: number) {
        setSpells((prev: ISpellJob[]) => prev.filter((_, index) => index !== indexToRemove));
    }

    function clearAll() {
        setSpells([]);
        setCastCount(0);
    }

    function saveToStorage() {
        if (!spells.length) return;
        // setStoredSpells(spells);
    }

    function restoreSpells() {
        if (!hasStoredSpells) return;
        // setSpells(storedSpells);
    }

    // --- Управление кастом ---
    function castSpell() {
        if (isCasting) return;

        setCastCount(0);
        setIsCasting(true);

        intervalIdRef.current = setInterval(() => {
            if (spellsRef.current.length > 0) {
                console.log('✨ Casting ritual:', spellsRef.current);
                setCastCount((prev) => prev + 1);
            } else {
                console.log('🌑 The book is empty, no spells to cast.');
            }
        }, SPEED);
    }

    function stopSpell() {
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }

        setIsCasting(false);
    }

    // Авто-стоп
    useEffect(() => {
        if (!isCasting) return;

        const timeoutMs = durationMinutes * 60 * 1000;
        const timeoutId = setTimeout(() => {
            stopSpell();
            console.log('🧙 The ritual has naturally concluded.');
        }, timeoutMs);

        return () => {
            clearTimeout(timeoutId);
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        };
    }, [isCasting, durationMinutes]);

    // --- Обработчики событий ---

    // --- NEW LOGIC ---
    // --- Back-end sync ---
    async function getSpells() {
        try {
            setIsLoading(true);
            setSpells([]);
        } catch (e: unknown) {
            console.warn(e);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(
        e: React.SubmitEvent,
        body: { spell: string; duration: string | number }
    ): Promise<{ success: boolean }> {
        e.preventDefault();

        if (!body.spell || !body.duration) {
            throw new Error('There should be spell and duration values');
        }

        try {
            const res = await fetch(`${baseUrl}/spells`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = (await res.json()) as ISpellJob & { message?: string };

            if (!res.ok) {
                const message = data.message ? data.message : null;
                throw new Error(message ?? `Request failed: ${res.status} ${res.statusText}`);
            }

            setSpells((prev) => [...prev, data]);

            // TODO: temporary
            console.log('Job created:', data);
            return { success: true };
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            console.warn('Could not create spell!', message);

            return { success: false };
        }
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <HeaderLogo />

                <div>
                    <ActionRow
                        onAdd={handleSubmit}
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
                    onSave={saveToStorage}
                    onRestore={restoreSpells}
                    isCasting={isCasting}
                    hasSpells={spells.length > 0}
                    canRestore={canRestore}
                    areSpellsSame={areSpellsSame}
                    spells={spellsStr}
                />
            </main>
        </div>
    );
}
