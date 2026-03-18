'use client';

import { useUserContext } from '@/context/UserContext';
import { Avatar, Box } from '@mui/material';
import Link from 'next/link';
import { memo } from 'react';

export const Header = memo(() => {
    const { userData } = useUserContext();

    if (!userData) {
        return null;
    }

    return (
        <Box
            className="header"
            component="header"
            sx={{ position: 'absolute', top: 25, right: 25 }}
        >
            <Link href="/profile">
                <Avatar src="/image_profile.webp" sx={{ width: 48, height: 48 }} />
            </Link>
        </Box>
    );
});
