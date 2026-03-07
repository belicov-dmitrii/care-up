'use client';
import { AddMedication } from '@/components/AddMedication/AddMedication';
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

export default function Pharmacy() {
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = useCallback(() => {
        return setOpenDrawer((prev) => !prev);
    }, []);

    return (
        <Box>
            <Typography variant="h1">Pharmacy</Typography>
            <Button onClick={toggleDrawer}>Add Medication</Button>
            <AddMedication open={openDrawer} onClose={toggleDrawer} />
        </Box>
    );
}
