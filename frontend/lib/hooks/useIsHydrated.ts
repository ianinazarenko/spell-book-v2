'use client';

import { useEffect, useState } from 'react';

export function useIsHydrated(): boolean {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true);
    }, []);

    return isHydrated;
}
