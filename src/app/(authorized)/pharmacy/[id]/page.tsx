import { getServerT } from '@/i18n';
import { getMedUnitDetails } from '@/utils/getMedExtendedDetails';
import { getMeds } from '@/utils/requests/getMeds';
import { PALETTE } from '@/utils/theme/colors';
import { Box, Container, Stack, Typography } from '@mui/material';

import { ColumnBoxStyles } from '@/utils/consts';
import { PharmacyItemForm } from '@/components/PharmacyItemForm/PharmacyItemForm';

interface IPharmacyItemDetailsProps {
    params: {
        id: string;
    };
}

export default async function PharmacyItemDetail({ params }: IPharmacyItemDetailsProps) {
    const t = await getServerT();
    const { id } = await params;
    const meds = await getMeds();
    const med = meds?.find((med) => med.id === id);

    if (!med) {
        return (
            <Typography
                variant="h5"
                sx={{
                    color: PALETTE.BRAND_GREY,
                    opacity: '0.6',
                    fontSize: 18,
                    textAlign: 'center',
                    padding: '40px 0',
                }}
            >
                {t('No data.')}
            </Typography>
        );
    }
    return (
        <Container
            sx={{
                ...ColumnBoxStyles,
                alignItems: 'center',
                padding: 3,
                textAlign: 'center',
                gap: 2.5,
            }}
        >
            <Box>
                <Typography variant="body1" fontWeight={600} mb={2}>
                    {t('Item Details')}
                </Typography>
                <Stack gap={1}>
                    <Typography variant="h1" fontSize={28}>
                        {med.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {getMedUnitDetails(med, false)}
                    </Typography>
                </Stack>
            </Box>
            <PharmacyItemForm med={med} />
        </Container>
    );
}
