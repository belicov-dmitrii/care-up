import { getServerT } from '@/i18n';
import { getMedUnitDetails, isDateExpiring } from '@/utils/getMedExtendedDetails';
import { getMeds } from '@/utils/requests/getMeds';
import { PALETTE } from '@/utils/theme/colors';
import {
    alpha,
    Box,
    Button,
    Container,
    type CSSProperties,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

import { ColumnBoxStyles, RowBoxStyles } from '@/utils/consts';
import { MedInventory } from '@/components/MedInventory/MedInventory';
import { getSchedule } from '@/utils/requests/getSchedule';
import { getScheduleByMedId } from '@/utils/sortAndFilterMeds';
import { formatMedExpirationDate } from '@/utils/formatData';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { PharmacyItemActions } from '@/components/PharmacyItemActions/PharmacyItemActions';

interface IPharmacyItemDetailsProps {
    params: {
        id: string;
    };
}

const actionButtonStyle: CSSProperties = {
    ...RowBoxStyles,
    color: 'text.primary',
    justifyContent: 'space-between',
    textAlign: 'left',
    gap: 0.2,
};

const paperStyles: CSSProperties = {
    ...ColumnBoxStyles,
    width: '100%',
    padding: 3,
    borderRadius: '14px',
};

export default async function PharmacyItemDetail({ params }: IPharmacyItemDetailsProps) {
    const t = await getServerT();
    const { id } = await params;
    const meds = await getMeds();
    const schedules = await getSchedule();
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

    const medExpirationColor = isDateExpiring(med.expirationDate) ? PALETTE.ERROR : PALETTE.SUCCESS;
    const medSchedule = getScheduleByMedId(med.id, schedules);

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
            <MedInventory med={med} />
            <Paper sx={paperStyles}>
                <Button sx={actionButtonStyle}>
                    <Box sx={{ ...RowBoxStyles, gap: 2 }}>
                        <Box
                            className="icon-container"
                            sx={{
                                backgroundColor: alpha(medExpirationColor, 0.1),
                                color: medExpirationColor,
                                width: 44,
                                height: 44,
                            }}
                        >
                            <PendingActionsIcon />
                        </Box>
                        <Stack gap={0.5}>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary', fontSize: 12, fontWeight: 600 }}
                            >
                                {t('Expiry Date')}
                            </Typography>
                            <Typography variant="body1">
                                {formatMedExpirationDate(med.expirationDate)}
                            </Typography>
                        </Stack>
                    </Box>
                </Button>
            </Paper>
            {medSchedule?.recommendations?.map((recommendation) => {
                return <InfoBox key={recommendation.id} {...recommendation} />;
            })}
            <PharmacyItemActions id={med.id} />
        </Container>
    );
}
