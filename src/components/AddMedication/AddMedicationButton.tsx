'use client';

import { Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { AddMedication } from './AddMedication';
import { AddButton } from '../AddButton';

export const AddMedicationButton = () => {
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = useCallback(() => {
        return setOpenDrawer((prev) => !prev);
    }, []);

    return (
        <Box sx={{ position: 'fixed', right: '10px', bottom: '100px' }}>
            <AddButton onClick={toggleDrawer} />
            <AddMedication open={openDrawer} onClose={toggleDrawer} />
        </Box>
    );
};
