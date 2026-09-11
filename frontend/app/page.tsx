'use client';

import styles from './page.module.css';
import { useEffect, useState, useRef } from 'react';
import { useLocalStorage, useSessionStorage } from '@/lib/hooks/useStorage';

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

    // --- Состояние (UI) ---
    const [spells, setSpells] = useSessionStorage<string[]>(SPELLS_KEY, []);
    const [storedSpells, setStoredSpells] = useLocalStorage<string[]>(SPELLS_KEY, []);
    const [durationMinutes, setDurationMinutes] = useLocalStorage<number>(DUR_KEY, 60);

    const [inputValue, setInputValue] = useState<string>('');
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
    useEffect(() => {
        spellsRef.current = spells;
    }, [spells]);

    // --- Utils ---
    function compareSpells() {
        return JSON.stringify(spells) === JSON.stringify(storedSpells);
    }

    // --- Магические действия (CRUD) ---
    function addSpell() {
        const trimmed = inputValue.trim();

        if (!!trimmed) {
            setSpells((prev) => [...prev, trimmed]);
            setInputValue('');
        }
    }

    function removeSpell(indexToRemove: number) {
        setSpells((prev: string[]) => prev.filter((_, index) => index !== indexToRemove));
    }

    function clearAll() {
        setSpells([]);
        setCastCount(0);
    }

    function saveToStorage() {
        if (!spells.length) return;
        setStoredSpells(spells);
    }

    function restoreSpells() {
        if (!hasStoredSpells) return;
        setSpells(storedSpells);
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
    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            addSpell();
        }
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <HeaderLogo />

                <div>
                    <ActionRow
                        durationMinutes={durationMinutes}
                        setDurationMinutes={setDurationMinutes}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        onAdd={addSpell}
                        isCasting={isCasting}
                        onKeyDown={handleKeyDown}
                    />

                    <SpellList spells={spells} onRemove={removeSpell} />

                    <CastStatus isCasting={isCasting} castCount={castCount} duration={SPEED} />
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
