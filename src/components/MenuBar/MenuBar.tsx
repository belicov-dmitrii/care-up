'use client';

import { memo, useState } from 'react';
import Box from '@mui/material/Box';
import LightModeIcon from '@mui/icons-material/LightMode';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { PALETTE } from '@/utils/theme/colors';
import { useRouter } from 'next/navigation';

type MenuAction = { icon: ReturnType<typeof LightModeIcon>; label: string; path: string };

const MENU_ACTIONS: MenuAction[] = [
    {
        icon: <LightModeIcon />,
        label: 'Today',
        path: 'dashboard',
    },
    {
        icon: <CalendarTodayIcon />,
        label: 'Schedule',
        path: 'schedule',
    },
    {
        icon: <MedicationLiquidIcon />,
        label: 'Pharmacy',
        path: '/',
    },
    {
        icon: <FolderCopyIcon />,
        label: 'Docs',
        path: '/',
    },
];

export const MenuBar = memo(() => {
    const [active, setActive] = useState<string>(MENU_ACTIONS[0].path);
    const router = useRouter();

    const handleActionChange = (_: any, path: string) => {
        setActive(path);
        router.replace(`/${path}`);
    };

    return (
        <Box>
            <BottomNavigation
                showLabels
                value={active}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 84,
                }}
                onChange={handleActionChange}
            >
                {MENU_ACTIONS.map((action) => {
                    return (
                        <BottomNavigationAction
                            key={action.label}
                            label={action.label}
                            value={action.path}
                            sx={{
                                gap: 0.5,
                                color:
                                    active === action.label
                                        ? PALETTE.BRAND_TEAL
                                        : PALETTE.BRAND_TEAL_PALE,
                                fontSize: 12,
                                fontWeight: 500,
                            }}
                            icon={action.icon}
                        />
                    );
                })}
            </BottomNavigation>
        </Box>
    );
});
