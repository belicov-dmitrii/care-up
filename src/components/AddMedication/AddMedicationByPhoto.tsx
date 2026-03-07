import { useCallback, type FC } from 'react';
import { type IAddMedicationChildProps } from './utils/types';
import { Box } from '@mui/material';
import { PhotoPicker } from '../PhotoPicker/PhotoPicker';
import { logError } from '@/utils/logError';
import { NetworkRequest } from '@/utils/NetworkRequest';
import { type Med } from '@/types';
import { AddMedicationStepChooser } from './utils/steps';

export const AddMedicationByPhoto: FC<IAddMedicationChildProps> = ({ changeMedData, setStep }) => {
    const onUpload = useCallback(
        async (file: File | null) => {
            try {
                if (!file) return;

                const fd = new FormData();
                fd.append('file', file);

                const { data, ok } = await NetworkRequest<{ fileName: string; med: Partial<Med> }>(
                    '/get-med-info',
                    {},
                    {
                        method: 'POST',
                        body: fd,
                    },
                    'formData'
                );

                if (!ok) throw new Error('Upload failed');

                changeMedData(data.med);
                setStep(AddMedicationStepChooser.ManualAdding);
            } catch (error) {
                logError(error);
            }
        },
        [changeMedData, setStep]
    );

    return (
        <Box>
            <PhotoPicker onUpload={onUpload} />
        </Box>
    );
};
