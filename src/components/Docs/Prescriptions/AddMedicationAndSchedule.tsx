'use client';

import { type Med } from '@/types';
import { useState } from 'react';

export const AddMedicationAndSchedule = () => {
    const [medDrawerIsOpen, setMedDrawerIsOpen] = useState();
    const [medData, setMedData] = useState<Partial<Med>>({});

    return <Box></Box>;
};
