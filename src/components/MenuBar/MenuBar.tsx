'use client';

import { memo } from 'react';
import Box from '@mui/material/Box';
import LightModeIcon from '@mui/icons-material/LightMode';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { PALETTE } from '@/utils/theme/colors';
import { usePathname } from 'next/navigation';

type MenuAction = { icon: ReturnType<typeof LightModeIcon>; label: string; path: string };

const MENU_ACTIONS: MenuAction[] = [
    {
        icon: <LightModeIcon />,
        label: 'Today',
        path: '/dashboard',
    },
    {
        icon: <CalendarTodayIcon />,
        label: 'Schedule',
        path: '/schedule',
    },
    {
        icon: <MedicationLiquidIcon />,
        label: 'Pharmacy',
        path: '/pharmacy',
    },
    {
        icon: <FolderCopyIcon />,
        label: 'Docs',
        path: '/',
    },
];

export const MenuBar = memo(() => {
    const pathName = usePathname();
    const parentPath = '/' + pathName.split('/')[1];

    return (
        <Box>
            <BottomNavigation
                showLabels
                value={pathName}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 84,
                }}
            >
                {MENU_ACTIONS.map((action) => {
                    return (
                        <BottomNavigationAction
                            key={action.label}
                            label={action.label}
                            value={action.path}
                            href={action.path}
                            sx={{
                                gap: 0.5,
                                color:
                                    parentPath === action.path
                                        ? PALETTE.BRAND_TEAL
                                        : PALETTE.BRAND_TEAL_DARK_PALE,
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
