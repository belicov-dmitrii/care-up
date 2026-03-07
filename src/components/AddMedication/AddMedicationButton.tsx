'use client';

import { Box, Button } from '@mui/material';
import { useCallback, useState } from 'react';
import { AddMedication } from './AddMedication';

export const AddMedicationButton = () => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = useCallback(() => {
        return setOpenDrawer((prev) => !prev);
    }, []);

    return (
        <Box>
            <Button onClick={toggleDrawer}>Add Medication</Button>
            <AddMedication open={openDrawer} onClose={toggleDrawer} />
        </Box>
    );
};
