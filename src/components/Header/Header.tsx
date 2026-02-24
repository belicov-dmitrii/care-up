'use client';

import { useUserContext } from '@/context/UserContext';
import { Box, Button } from '@mui/material';
import { memo } from 'react';

export const Header = memo(() => {
    const { logout, userData } = useUserContext();

    if (!userData) {
        return null;
    }

    return (
        <Box className="header" component="header">
            <Button onClick={logout}>Log out</Button>
        </Box>
    );
});
